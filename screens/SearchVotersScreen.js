import React,{useState,useEffect} from 'react'
import {View,StyleSheet,FlatList,ActivityIndicator} from 'react-native'
import AppContainer from '../components/AppContainer';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import AppPicker from '../components/AppPicker';
import { useFocusEffect } from '@react-navigation/native';
import { apiCall, fetchAllDataFromTable } from '../Services';
import VoterCard from '../components/VoterCard';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo"; 

const AppPickerData = [
    {
        id:1,
        title:'Search By Name'
    },
    {
        id:2,
        title:'Search By Booth'
    },
    {
        id:3,
        title:'Search By Mobile'
    },
    {
        id:4,
        title:'Search By ID Card No'
    },
    {
        id:5,
        title:'Search By Society'
    },

]

const SearchVotersScreen = ({navigation,route}) =>{
    const [voterList,setVoterList] = useState([])
    const [votersToBeDisplayed,setVotersToBeDisplayed] = useState([])
    const [isLoading,setIsLoading] = useState(false)
    const [selectedSearchTypeValue,setSelectedSearchTypeValue] = useState('Search By Name')
    const [boothList,setBoothList] = useState([])
    const [selectedBooth,setSelectedBooth] = useState('')
    const [firstNameSearchText,setFirstNameSearchText] = useState('')
    const [middleNameSearchText,setMiddleNameSearchText] = useState('')
    const [lastNameSearchText,setLastNameSearchText] = useState('')
    const [searchText,setSearchText] = useState('');

    const onPickerTypeChange = (searchTypeId) =>{
        const selectedType =  AppPickerData.find((data) => data.id === searchTypeId)
        setSelectedSearchTypeValue(selectedType.title)
        if(selectedType.id === 2){
            console.log(5353)
            onSearchClicked()
        }
    }

    const onBoothChange = (booth) =>{
        setSelectedBooth(booth)
    }

    useFocusEffect(
        React.useCallback(() => {
            
            async function setUserDetails(){
                const userDetails = JSON.parse(await AsyncStorage.getItem('userData')); 
                setBoothList([...userDetails?.assignedBooths.map((booth)=> {
                    return {
                        id:booth,
                        title:booth
                    }
                })])
                setSelectedBooth(userDetails?.assignedBooths.length > 0 ? userDetails?.assignedBooths[0]:null)
            }

            async function fetchVoterList(){
                // const getVoterListFromDB = await fetchAllDataFromTable('VoterList');
                setIsLoading(true);
                const societyListFromStorage = JSON.parse(await AsyncStorage.getItem('societyList'));
                const voterListPayloadArr = [];

                societyListFromStorage?.forEach((society) => {
                    voterListPayloadArr.push({
                        acNo:society.AC_NO,
                        stCode:society.ST_CODE,
                        boothNo:society.BOOTH_NO
                    })
                })
                let votersList = await fetchAllDataFromTable('VoterList');
                // let votersListResponse = await apiCall('post','getVoterList',{values:voterListPayloadArr});
                let votersPassedFromRoute = JSON.parse(route.params? route.params.voters : null )
                
                if(votersPassedFromRoute && votersPassedFromRoute.length > 0){
                    setVotersToBeDisplayed([...votersPassedFromRoute])
                    setVoterList([...votersPassedFromRoute])
                }else{
                    setVotersToBeDisplayed([...votersList])
                    setVoterList([...votersList])
                }
                setIsLoading(false);
            }

            async function syncUnsyncedVoters(){ 
                let unSyncedVoters = JSON.parse(await AsyncStorage.getItem('unSyncedVoters'));
                console.log('unSyncedVoters',unSyncedVoters)
                
                let netInformation = await NetInfo.fetch()

                if(netInformation.isConnected && unSyncedVoters){
                    let updateVoterResponse = await apiCall('post','updateVoter',{values:unSyncedVoters})
                    if(updateVoterResponse.status === 200){
                        console.log('Voters Updated Successfully')
                        await AsyncStorage.removeItem('unSyncedVoters');
                    }
                    else{
                        console.log('Error Updating Voters',updateVoterResponse.error)
                    }
                }
                else{
                    console.log('No Need to Sync');
                }
            }

            setUserDetails();
            syncUnsyncedVoters()
            fetchVoterList()
        }, [])
    );

    const onVoterCardClick = (item) =>{
        navigation.navigate('VoterProfileScreen',{voter:JSON.stringify(item)})
    }

    const onSearchClicked = () => {
        setIsLoading(true)
        const selectedType = AppPickerData.find((data) => data.title === selectedSearchTypeValue)
        const voterLists = [...voterList];
        let voterListToBeDisplayed;
        console.log('true',selectedType)
        switch(selectedType.id){
            case 1:
                voterListToBeDisplayed = voterLists.filter((voter)=> voter.ENG_F_NAME?.toLowerCase().includes(firstNameSearchText.trim().toLowerCase()) &&
                                                                     voter.ENG_M_NAME?.toLowerCase().includes(middleNameSearchText.trim().toLowerCase()) && 
                                                                     voter.ENG_SURNAME?.toLowerCase().includes(lastNameSearchText.trim().toLowerCase()))
                setVotersToBeDisplayed([...voterListToBeDisplayed])
                break;
            case 2:
                voterListToBeDisplayed = voterLists.filter((voter)=> {
                    return parseInt(voter.BOOTH_NO) === parseInt(selectedBooth) &&
                    voter.ENG_F_NAME?.toLowerCase().includes(firstNameSearchText.trim().toLowerCase()) &&
                    voter.ENG_M_NAME?.toLowerCase().includes(middleNameSearchText.trim().toLowerCase()) && 
                    voter.ENG_SURNAME?.toLowerCase().includes(lastNameSearchText.trim().toLowerCase()) 
                })
        
                setVotersToBeDisplayed([...voterListToBeDisplayed])
                break;

            case 3:
                voterListToBeDisplayed = voterLists.filter((voter)=> {
                    return voter.CONTACTNO?.includes(searchText) || voter.CONTACTNO2?.includes(searchText)
                })
                setVotersToBeDisplayed([...voterListToBeDisplayed])
                break;
            case 4:
                voterListToBeDisplayed = voterLists.filter((voter)=> {
                    return voter.IDCARD_NO?.includes(searchText)
                })
                setVotersToBeDisplayed([...voterListToBeDisplayed])
                break;
            case 5:
                voterListToBeDisplayed = voterLists.filter((voter)=> {
                    return voter.ENG_HOUSE_NO?.includes(searchText)
                })
                setVotersToBeDisplayed([...voterListToBeDisplayed])
                break;

            default:
                break; 
        }
        setIsLoading(false)
    }

    
    return(
        <AppContainer style={styles.AppContainer}>
             <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                 {
                     selectedSearchTypeValue === 'Search By Booth' ? 
                        <>
                        <AppPicker onSelectData={onPickerTypeChange} 
                            value={selectedSearchTypeValue} 
                            style={{width:selectedSearchTypeValue === 'Search By Booth' ? '50%' : '100%'}} 
                            data={AppPickerData}/>

                        <AppPicker onSelectData={onBoothChange} 
                                    value={selectedBooth} 
                                    style={{width:'48%'}} 
                                    data={boothList}/>
                        </>
                     :
                     <AppPicker onSelectData={onPickerTypeChange} 
                            value={selectedSearchTypeValue} 
                            style={{width:'100%'}} 
                            data={AppPickerData}/>
                 }

             </View>
             
             <View style={styles.SearchFilterContainer}>
                 {
                     selectedSearchTypeValue === 'Search By Name' || selectedSearchTypeValue === 'Search By Booth' ? 
                     <View style={{width:'85%',flexDirection:'row',justifyContent:'space-around'}}>
                        <AppInput 
                            icon={''}
                            hasIcon={true}
                            style={{...styles.SignInInput,...{width:'32%'}}}
                            placeholderText="First Name"
                            onTextChange={(e)=>setFirstNameSearchText(e)}/>

                        <AppInput 
                            icon={''}
                            hasIcon={true}
                            style={{...styles.SignInInput,...{width:'32%'}}}
                            placeholderText="Middle Name"
                            onTextChange={(e)=>setMiddleNameSearchText(e)}/>
                        
                        <AppInput 
                            icon={''}
                            hasIcon={true}
                            style={{...styles.SignInInput,...{width:'32%'}}}
                            placeholderText="Last Name"
                            onTextChange={(e)=>setLastNameSearchText(e)}/>
                     </View>
                     :
                    <AppInput 
                            icon={''}
                            hasIcon={true}
                            style={styles.SignInInput}
                            isNumeric={selectedSearchTypeValue === 'Search By Mobile' ? true : false}
                            placeholderText={ selectedSearchTypeValue === 'Search By Mobile' ? 
                                                "Mobile Number": 
                                              selectedSearchTypeValue === 'Search By ID Card No' ? 
                                                "Id Card No" : 
                                                "Search By Society"}
                            onTextChange={(e)=>setSearchText(e)}/>}
                 <AppButton
                    icon = 'search' 
                    iconColor='white' 
                    iconSize={24} 
                    text={null}
                    hideText={true}
                    iconStyle={{marginRight:0}}
                    textStyle={{fontSize:18}}
                    onPressButton={()=>onSearchClicked()}
                    buttonStyle={styles.FilterButton}  />
            </View>
            <View style={styles.VisitContainer}>
                {
                votersToBeDisplayed?.length > 0 ? 
                    isLoading ?
                        <ActivityIndicator size="large" color="#f49d34"/>
                    :
                    <FlatList 
                        style={{width:'100%'}}
                        data={votersToBeDisplayed}
                        renderItem={({ item, index, separators }) => <VoterCard item={item} index ={index} onVoterCardPress={onVoterCardClick}/>}
                        keyExtractor = {(item) => item.IDCARD_NO}/>
                    :
                    isLoading ?
                        <ActivityIndicator size="large" color="#f49d34"/>:null
                }
            </View>
        </AppContainer>
       
    )
}

const styles = StyleSheet.create({
    AppContainer:{
        alignItems:'flex-start',
        padding:10
    },
    SignInInput:{
        width:'80%',
        backgroundColor:'white'
    },
    SearchFilterContainer:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:5
    },
    AppCard:{
        width:'100%',
        backgroundColor:'white',
        borderRadius:5,
        height:140,
        marginVertical:5,
        flexDirection:'row',
        borderRightWidth:7
    },
    Photo:{
        width:'100%',
        height:'100%',
        resizeMode:'stretch'
    },
    AppCardDetails:{
        width:'100%',
        marginVertical:10
    },
    AppCardFullDivision:{
        marginTop:7,
        alignItems:'flex-start',
        justifyContent:'flex-start',
        width:'100%'
    },
    AppCardRowDivisionAppText:{
        color:'#ccc',
        fontSize:12
    },
    AppCardRowDivisionAppBoldText:{
        fontSize:12
    },
    AppCardRow:{
        marginTop:7,
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent:'space-between',
        width:'100%'
    },
    FilterButton:{
        marginTop:10,
        marginLeft:5,
        backgroundColor:'#f49d34',
        width:'15%'
    },
    VisitContainer:{
        flex:1,
        width:'100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
})


export default SearchVotersScreen;
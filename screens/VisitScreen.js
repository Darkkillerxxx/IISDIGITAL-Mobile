import React,{useState,useEffect,useContext} from "react";
import {StyleSheet,View,FlatList,Modal,TouchableOpacity,Image,ActivityIndicator} from 'react-native' 
import NetInfo from "@react-native-community/netinfo"; 
import AppButton from "../components/AppButton";
import AppContainer from '../components/AppContainer'
import AppInput from '../components/AppInput'
import AppText from "../components/AppText";
import AppCard from "../components/AppCard";
import AppTextBold from '../components/AppTextBold'
import AsyncStorage from "@react-native-community/async-storage";
import VisitModal from "../components/VisitModal";
import AppSwitch from "../components/AppSwitch";
import { apiCall,fetchAllDataFromTable } from "../Services";
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../context/AuthContext";


const VisitScreen = ({navigation}) => {
    const [showFilterModule,setFilterModule] = useState(false)
    const [isLoading,setIsLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [voters,setVoters] = useState([]);
    const [votersToBeDisplayed,setvotersToBeDisplayed] = useState([]);
    const [recordsLimit,setRecordsLimit] = useState(100);
    const [showAllfamily,setShowAllFamily] = useState(false);
    const [visitScreenFilter,setVisitScreenFilter] = useState({acNo:null,boothNo:null,vibhagNo:null,houseNo:null,search:null})

    useFocusEffect(
        React.useCallback(() => {
            async function fetchDatFromAsyncAndFilter(){ 
                let visitScreenFilterFromStorage = await AsyncStorage.getItem('visitScreenFilter');
                // console.log(313131,visitScreenFilterFromStorage)
                if(visitScreenFilterFromStorage){
                    setVisitScreenFilter(await JSON.parse(visitScreenFilterFromStorage))
                }
            }

            async function downloadUpdatedData(){
              let votersListArr = []
              let societyList = JSON.parse(await AsyncStorage.getItem('societyList'));
          

              societyList.forEach((society,index) => {
                votersListArr.push({
                  acNo:society.AC_NO,
                  stCode:society.ST_CODE,
                  boothNo:society.BOOTH_NO,
                  vibhagNo:society.VIBHAG_NO,
                })
              })

              let votersListResponse = await apiCall('post','getVoterList',{values:votersListArr});
             
              if(votersListResponse.status === 200){
                console.log(57,votersListResponse.voterList.length);

                await AsyncStorage.setItem('lastVoterListSync',new Date().toISOString());
                console.log('All Set');
              }
              else{
                console.log(65,votersListResponse.error)
              }
            }

            async function syncUnsyncedVoters(){ 
                let unSyncedVoters = JSON.parse(await AsyncStorage.getItem('unSyncedVoters'));
                console.log('unSyncedVoters',unSyncedVoters)
                
                let netInformation = await NetInfo.fetch()

                if(netInformation.isConnected && unSyncedVoters){
                    let updateVoterResponse = await apiCall('post','updateVoter',{values:unSyncedVoters})
                // console.log("updateVoterResponse",updateVoterResponse)
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
            
            fetchDatFromAsyncAndFilter();
            // downloadUpdatedData();
            syncUnsyncedVoters();

        }, [])
    );

    useEffect(()=>{
        filterVotersAccToLimit(voters); 
    },[recordsLimit,voters])

    useEffect(()=>{
        applyFilter(visitScreenFilter,visitScreenFilter.search);
    },[])

    useEffect(()=>{
        applyFilter(visitScreenFilter,visitScreenFilter.search)
    },[showAllfamily])

    

    const filterVotersAccToLimit = (filteredVoterList) =>{
         
        let limitedVoters = [];

        filteredVoterList.some((voters,index)=>{
            limitedVoters.push(voters);
            return index > (recordsLimit - 1)
        })

        // console.log(51,limitedVoters.length)

        setvotersToBeDisplayed([...limitedVoters])
    }

    const onCancelClicked = () => {
        setModalVisible(false)
    }

    const onSearchChange = async(e) =>{
        applyFilter(visitScreenFilter,e)
    }


    const applyFilter = async(filterValues,searchedText = null)=>{
        setIsLoading(true)
        let userData = await AsyncStorage.getItem('userData');
        userData = JSON.parse(userData);
        
        console.log('From Apply Filter',filterValues)

        visitScreenFilter.acNo = filterValues.acNo;
        visitScreenFilter.boothNo = filterValues.boothNo;
        visitScreenFilter.vibhagNo = filterValues.vibhagNo;
        visitScreenFilter.houseNo = filterValues.houseNo;    
        visitScreenFilter.search = searchedText;

        setVisitScreenFilter({...visitScreenFilter})
        await AsyncStorage.setItem('visitScreenFilter',JSON.stringify(visitScreenFilter));

        let votersList = await fetchAllDataFromTable('VoterList');

        let filteredVotersList;
        
        console.log(149,showAllfamily)
        if(showAllfamily){
            filteredVotersList = votersList.filter((voter)=>{
           
                if((filterValues.acNo === null || filterValues.acNo?.toString() === voter.AC_NO?.toString()) 
                    && (filterValues.boothNo === null || filterValues.boothNo?.toString() === voter.BOOTH_NO?.toString()) 
                    && (filterValues.vibhagNo === null || filterValues.vibhagNo?.toString() === voter.VIBHAG_NO?.toString())
                    && (filterValues.houseNo === null || filterValues.houseNo?.toString() === voter.HOUSE_NO?.toString())
                    && (voter.ENG_F_NAME.toLowerCase().includes(searchedText ? searchedText.toLowerCase() : '') || voter.SL_NO.toString().includes(searchedText ? searchedText : ''))
                    ){
                        return true;
                }
                return false
            })
        }
        else{
            filteredVotersList = votersList.filter((voter)=>{
                if((filterValues.acNo === null || filterValues.acNo.toString() === voter.AC_NO.toString()) 
                    && (filterValues.boothNo === null || filterValues.boothNo?.toString() === voter.BOOTH_NO?.toString()) 
                    && (filterValues.vibhagNo === null || filterValues.vibhagNo?.toString() === voter.VIBHAG_NO?.toString())
                    && (filterValues.houseNo === null || filterValues.houseNo?.toString() === voter.HOUSE_NO?.toString())
                    && ((voter.ENG_F_NAME.toLowerCase().includes(searchedText ? searchedText.toLowerCase() : '') || voter.SL_NO.toString().includes(searchedText ? searchedText : '')))
                    && (voter.LAST_UPD_ID !== userData.id)){
                        return true;
                }
                return false
            })
        }
        setVoters([...filteredVotersList]);
        setIsLoading(false)
        setModalVisible(false);
    }

    const onFilterComponentRemoval= async(componentName) => {
        let screenFilter = {...visitScreenFilter}
        screenFilter[componentName] = null

        setVisitScreenFilter({...screenFilter})
        await AsyncStorage.setItem('visitScreenFilter',JSON.stringify(screenFilter));
        applyFilter(screenFilter)
    }

    const toggleSwitch = async(allFamily) =>{
        setShowAllFamily(allFamily)
      } 

    const onShowMore = () =>{
        setRecordsLimit(recordsLimit + 100);
    }

    const voterCard = (item,index) => {
        return(
            <>
            <TouchableOpacity key={index} onPress={()=>navigation.navigate('VoterProfileScreen',{voter:JSON.stringify(item)})}>    
                <AppCard style={{...styles.AppCard,...{borderRightColor:item.COLORCODE === "1" ? "#2ab574":item.COLORCODE === "2" ? "#f5bb18":item.COLORCODE === "3" ? "#ff6961":'white'}}}>
                    <View style={{width:'30%'}}>
                        <Image source={item.ePhoto && item.ePhoto !== 'null' ? { uri : 'data:image/png;base64,'+ item.ePhoto } : item.SEX ==='M' ? require('../assets/images/empty.png') : require('../assets/images/emptyFemale.jpg')} style={styles.Photo}/>
                    </View>
                    <View style={{width:'70%',padding:10}}>
                        <View style={styles.AppCardDetails}>
                            <View style={styles.AppCardFullDivision}>
                                <AppText style={styles.AppCardRowDivisionAppText}>Name</AppText>
                                <AppTextBold style={styles.AppCardRowDivisionAppBoldText}>{`${item.F_NAME && item.F_NAME !== 'null'? item.F_NAME:''} ${item.M_NAME && item.M_NAME !== 'null' ? item.M_NAME : ''} ${item.SURNAME && item.SURNAME !== 'null' ? item.SURNAME : '' }`}</AppTextBold>
                            </View>
                            <View style={styles.AppCardRow}>
                                <View style={styles.AppCardRowDivision}>
                                    <AppText style={styles.AppCardRowDivisionAppText}>Contact No</AppText>
                                    <AppTextBold style={styles.AppCardRowDivisionAppBoldText}>{`${item.CONTACTNO && item.CONTACTNO !== 'null' ? item.CONTACTNO:''}`}</AppTextBold>
                                </View>
                                <View style={styles.AppCardRowDivision}>
                                    <AppText style={styles.AppCardRowDivisionAppText}>SL No.</AppText>
                                    <AppTextBold style={styles.AppCardRowDivisionAppBoldText}>{item?.SL_NO}</AppTextBold>
                                </View>
                            </View>
                            <View style={styles.AppCardRow}>
                                <View style={styles.AppCardRowDivision}>
                                    <AppText style={styles.AppCardRowDivisionAppText}>Birth Date</AppText>
                                    <AppTextBold style={styles.AppCardRowDivisionAppBoldText}>{item?.BIRTHDATE?.length > 0 ? item.BIRTHDATE.split('T')[0].split('-')[2] + '-' + item.BIRTHDATE.split('T')[0].split('-')[1] + '-' + item.BIRTHDATE.split('T')[0].split('-')[0] : ''}</AppTextBold>
                                </View>
                                
                                <View style={styles.AppCardRowDivision}>
                                    <AppText style={styles.AppCardRowDivisionAppText}>House No.</AppText>
                                    <AppTextBold style={styles.AppCardRowDivisionAppBoldText}>{item?.ENG_HOUSE_NO && item?.ENG_HOUSE_NO !== 'null' ? item?.ENG_HOUSE_NO :''}</AppTextBold>
                                </View>
                            </View>
                        </View>
                    </View>
                   
                </AppCard>
            </TouchableOpacity>

            {index === recordsLimit ? 
                <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                    <AppButton
                        icon = 'reload' 
                        iconColor='white' 
                        iconSize={24} 
                        text={'Show More Records'}
                        hideText={false}
                        iconStyle={{marginRight:10}}
                        textStyle={{fontSize:18}}
                        onPressButton={()=>onShowMore()}
                        buttonStyle={styles.ShowMoreButton} />
                </View>
            : 
            null}
            </>
        )
    }
    
    return(
        <AppContainer style={styles.AppContainer}>
            
            <View style={styles.SearchFilterContainer}>
                <AppInput 
                    icon={'search'}
                    hasIcon={true}
                    style={styles.SignInInput}
                    placeholderText="Search Voters"
                    onTextChange={onSearchChange}/>
                 <AppButton
                    icon = 'filter' 
                    iconColor='white' 
                    iconSize={24} 
                    text={null}
                    hideText={true}
                    iconStyle={{marginRight:0}}
                    textStyle={{fontSize:18}}
                    onPressButton={()=>setModalVisible(true)}
                    buttonStyle={styles.FilterButton}  />
            </View>

            {visitScreenFilter.boothNo ? 
            <View style={{width:'100%',flexDirection:'row',marginTop:10}}>
                <TouchableOpacity onPress={()=>onFilterComponentRemoval('boothNo')}>
                    <View style={styles.CustomCheckBox}>
                        <AppText style={{color:'white'}}>Booth No :- {visitScreenFilter.boothNo}</AppText>
                    </View>
                </TouchableOpacity>
                
                {visitScreenFilter.vibhagNo ? 
                    <TouchableOpacity onPress={()=>onFilterComponentRemoval('vibhagNo')}>
                        <View style={styles.CustomCheckBox}>
                            <AppText style={{color:'white'}}>Vibhag No :- {visitScreenFilter.vibhagNo}</AppText>
                        </View>
                    </TouchableOpacity>
                :
                null}

                {
                   visitScreenFilter.houseNo ?
                   <TouchableOpacity onPress={()=>onFilterComponentRemoval('houseNo')}>
                        <View style={styles.CustomCheckBox}>
                            <AppText style={{color:'white'}}>House No :- {visitScreenFilter.houseNo}</AppText>
                        </View>
                    </TouchableOpacity>
                    :
                    null  
                } 
            </View>
            :
            null}
            

            <View style={{width:'100%',marginTop:20}}>
                <AppSwitch text="All Family" toggle={toggleSwitch} trackColorSelected="#1890ff" trackColorUnSelected="#bcc4cb" thumbColorSelected="#ffa87d" thumbColorUnSelected="#f4f3f4" backColor="#3e3e3e"/>
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
                        renderItem={({ item, index, separators }) => voterCard(item,index)}
                        keyExtractor = {(item) => item.IDCARD_NO}/>
                    :
                    isLoading ?
                        <ActivityIndicator size="large" color="#f49d34"/>:null
                }
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                setModalVisible(!modalVisible);
                }}
            >
                <VisitModal
                    onCancel={onCancelClicked}
                    applyFilter={applyFilter}/>
            </Modal>

         
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
    },
    FilterButton:{
        marginTop:10,
        backgroundColor:'#f49d34',
        width:'15%'
    },
    CustomCheckBox:{
        height:35,
        margin:5,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#f49d34',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#f49d34',
        marginHorizontal:5,
        padding:5
    },
    ShowMoreButton:{
        width:'80%',
        height:50,
        marginTop:25,
        backgroundColor:'#f49d34'
    },
    VisitContainer:{
        flex:1,
        width:'100%',
        marginTop:10
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
    AppCardDetails:{
        width:'100%',
        marginVertical:10
    },
    AppCardRow:{
        marginTop:7,
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent:'space-between',
        width:'100%'
    },
    AppCardRowDivision:{
        alignItems:'flex-start',
        justifyContent:'flex-start',
        width:'50%'
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
    Photo:{
        width:'100%',
        height:'100%',
        resizeMode:'stretch'
    }  
})


export default VisitScreen;
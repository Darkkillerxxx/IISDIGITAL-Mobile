import React,{useState,useEffect} from 'react'
import {View,StyleSheet,Text} from 'react-native';
import AppContainer from '../components/AppContainer';
import AppPicker from '../components/AppPicker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { apiCall, fetchAllDataFromTable } from '../Services';
import AppText from '../components/AppText';
import Summary from '../components/Summary';
import {eCast,votersMood} from '../utils/utils';
import VoterSummaryComponent from '../components/VoterSummary';


const SummaryPickerData = [
    {
        id:1,
        title:'AC Wise Voter Summary'
    },
    {
        id:2,
        title:'Booth Wise Summary'
    }
]

const VoterSummary = ({navigation}) =>{
    const [voterData,setVoterData]=useState(null);
    const [pickerValue,setPickervalue] = useState('AC Wise Voter Summary');


    const onSummaryTypeChange = async(id) => {
        let selectedSummaryId = SummaryPickerData.find((summary) => summary.id === id)
        setPickervalue(selectedSummaryId.title)
        switch(id){
            case 1:
                const getVoterListFromDB = await fetchAllDataFromTable('VoterList');
                setVoterList([...getVoterListFromDB])
                break;
            
            case 2:
                const user = JSON.parse(await AsyncStorage.getItem('userData'));
                let assignedBooths = []
                user?.assignedBooths.forEach(booth => {
                    assignedBooths.push({
                        id:booth,
                        title:booth
                    })
                });
                //console.log(7575,assignedBooths[0]?.title)
                setBoothListValue(assignedBooths[0]?.title)
                setBoothList([...assignedBooths])

                break;
            
            case 3:
                setCasteValue(eCast[0].title);
                console.log(7373,eCast[0].title)
                onCastChange(eCast[0].id);
                break;

            case 4:
                setMoodValue(votersMood[0].title);
                onVoterMoodsChange(votersMood[0].id)
                setVoterMoodList([...votersMood])
                break;

            default:
                break;
        }
        
    }
    
    useFocusEffect(
      
        React.useCallback(() => {
            //console.log(94)
            async function getUserDetails(){
                console.log(5757,await AsyncStorage.getItem('userData'))
            }

            async function fetchAccountVoterSummary(){
                const accountVoterSummary = await apiCall("post","getVoterSummary",{type:1});
                if(accountVoterSummary.status === 200){
                    setVoterData(accountVoterSummary.voterList);
                }
            }

            getUserDetails();
            fetchAccountVoterSummary();
        }, [])
    );

    return(
        <AppContainer style={styles.AppContainer}>
             <AppPicker onSelectData={onSummaryTypeChange} value={pickerValue} style={{width:'100%'}} data={SummaryPickerData}/>
             {/* {pickerValue === 'AC Wise Summary' ? 
             null
            :pickerValue === 'Booth Wise Summary' && boothList.length > 0 ?
            <View style={{width:'100%',marginTop:20}}>  
                <AppText>Select Booth No.</AppText>
                <AppPicker onSelectData={onBoothTypeChange} value={boothListValue} style={{width:'100%'}} data={boothList}/>
            </View>:
            null}*/}
            {
            voterData ? 
                <VoterSummaryComponent voterList={voterData} />
            :null}
            
        </AppContainer>
    ) 
}

const styles = StyleSheet.create({
    AppContainer:{
        alignItems:'flex-start',
        padding:10
    },
    TableContainer:{
        width:'100%',
        height:15,
        marginTop:10,
        flexDirection:'row'
    },
    TableHeaderContainer:{
        width:'25%',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        height:25
    }
})

export default VoterSummary;
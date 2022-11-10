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
    const [voterDataForBooths,setVoterDataForBooths] = useState([]);
    const [pickerValue,setPickervalue] = useState('AC Wise Voter Summary');
    const [boothList,setBoothList] = useState([]);
    const [selectedBooth,setSelectedBooth] = useState(null);

    const onSummaryTypeChange = async(id) => {
        let selectedSummaryId = SummaryPickerData.find((summary) => summary.id === id)
        setPickervalue(selectedSummaryId.title)
        switch(id){
            case 1:
                break;
            
            case 2:
                const voterSummaryBooth = await apiCall("post","getVoterSummary",{type:2});
                if(voterSummaryBooth.status === 200){
                    const boothList = []
                    setVoterDataForBooths([...voterSummaryBooth.voterList]);
                    voterSummaryBooth.voterList.forEach((booth)=>{
                        boothList.push({id:booth.BOOTH_NO,title:booth.BOOTH_NO});
                    })
                    setBoothList([...boothList]);
                    if(boothList.length>0){
                        setSelectedBooth(boothList[0].title);
                        setVoterSummaryDataForSelectedBooth(voterSummaryBooth.voterList,1);
                    }
                }
                
                break;
                
            default:
                break;
        }
        
    }

    const setVoterSummaryDataForSelectedBooth = (voterList,boothNo) =>{
        const votersData = voterList.find((voterData)=> voterData.BOOTH_NO === boothNo);
        setVoterData({...votersData});
    }

    const onBoothTypeChange = (id)=>{
        setSelectedBooth(id);
        setVoterSummaryDataForSelectedBooth(voterDataForBooths,id);
    }
    
    useFocusEffect(
      
        React.useCallback(() => {
            async function getUserDetails(){
                console.log(5757,await AsyncStorage.getItem('userData'))
            }

            async function fetchAccountVoterSummary(){
                const accountVoterSummary = await apiCall("post","getVoterSummary",{type:1});
                if(accountVoterSummary.status === 200){
                    setVoterData(accountVoterSummary.voterList[0]);
                }
            }

            getUserDetails();
            fetchAccountVoterSummary();
        }, [])
    );

    return(
        <AppContainer style={styles.AppContainer}>
             <AppPicker onSelectData={onSummaryTypeChange} value={pickerValue} style={{width:'100%'}} data={SummaryPickerData}/>
             {pickerValue === 'AC Wise Summary' ? 
             null
            :pickerValue === 'Booth Wise Summary' && boothList.length > 0 ?
            <View style={{width:'100%',marginTop:20}}>  
                <AppText style={{marginLeft:10}}>Select Booth No.</AppText>
                <AppPicker onSelectData={onBoothTypeChange} value={selectedBooth} style={{width:'100%'}} data={boothList}/>
            </View>:
            null}
            {
            voterData ? 
                <VoterSummaryComponent navigation={navigation} boothNo={selectedBooth} voterList={voterData} />
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
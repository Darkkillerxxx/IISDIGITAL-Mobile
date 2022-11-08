import React,{useState,useEffect} from 'react'
import {View,StyleSheet,Text} from 'react-native';
import AppContainer from '../components/AppContainer';
import AppPicker from '../components/AppPicker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { fetchAllDataFromTable } from '../Services';
import AppText from '../components/AppText';
import Summary from '../components/Summary';
import {eCast,votersMood} from '../utils/utils'


const SummaryPickerData = [
    {
        id:1,
        title:'AC Wise Summary'
    },
    {
        id:2,
        title:'Booth Wise Summary'
    },
    {
        id:3,
        title:'Cast Wise Summary'
    },
    {
        id:4,
        title:'Color Wise Summary'
    },
    {
        id:5,
        title:'Birthdate Wise Summary'
    },
]



const SummaryScreen = ({navigation}) =>{
    const [voterList,setVoterList] =  useState([]);
    const [pickerValue,setPickervalue] = useState('AC Wise Summary');
    const [subPicklistValue,setSubPicklistValue] = useState('');
    const [boothList,setBoothList] = useState([])
    const [boothListValue,setBoothListValue] = useState('')
    const [casteValue,setCasteValue] = useState('')
    const [moodValue,setMoodValue] = useState('')
    const [voterMoodList,setVoterMoodList] = useState([]);


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

    useEffect(()=>{
        onBoothTypeChange(boothList[0]?.id)
    },[boothList])

    const onCastChange = async(id)=>{
        const getVoterListFromDB = await fetchAllDataFromTable('VoterList');
        setVoterList([...getVoterListFromDB])

        let selectedCast = eCast.find((cast)=> cast.id === id);
        setCasteValue(selectedCast.title)
        //console.log(selectedCast)

        let selectedCastVoters = [];
        getVoterListFromDB.forEach((voter)=>{
            if(voter.eCAST === selectedCast.title){
                selectedCastVoters.push(voter)
            }
        })
        setVoterList([...selectedCastVoters])
    }

    const onVoterMoodsChange = async(id) =>{
        const getVoterListFromDB = await fetchAllDataFromTable('VoterList');
        setVoterList([...getVoterListFromDB])

        console.log(110,id)
        let selectedVoterMood = votersMood.find((voterMood)=>{ 
            return parseInt(voterMood.id) === parseInt(id)});
        setMoodValue(selectedVoterMood.title)
        let selectedVotersWithSelectedMoods = [];

        getVoterListFromDB.forEach((voter)=>{
            if(parseInt(voter.COLORCODE) === parseInt(selectedVoterMood.id)){
                selectedVotersWithSelectedMoods.push(voter)
            }
        })

        console.log("selectedVotersWithSelectedMoods.length",selectedVotersWithSelectedMoods.length)
        setVoterList([...selectedVotersWithSelectedMoods])

    }

    const onBoothTypeChange = async (id) => {
        try{
            const getVoterListFromDB = await fetchAllDataFromTable('VoterList');
            setVoterList([...getVoterListFromDB])

            let selectedBooth = boothList.find((summary) => summary.id.toString() === id.toString())
            
            setBoothListValue(selectedBooth.title)
    
            //console.log("voterList Length",voterList.length)
    
            let votersAssignedToBooth = []
            getVoterListFromDB.forEach((voter)=>{
                if(voter.BOOTH_NO.toString() === selectedBooth.title.toString()){
                    votersAssignedToBooth.push(voter)
                }
            })
    
            //console.log("votersAssignedToBooth.length",votersAssignedToBooth.length)
            setVoterList([...votersAssignedToBooth]);
        }
        catch(e)
        {
            //console.log(e)
        }
       
    }

    useFocusEffect(
      
        React.useCallback(() => {
            //console.log(94)
            async function getUserDetails(){
                console.log(5757,await AsyncStorage.getItem('userData'))
            }

            async function fetchVoterListAndSetSummary(){
                const getVoterListFromDB = await fetchAllDataFromTable('VoterList');
                setVoterList([...getVoterListFromDB])
            }

            getUserDetails()
            fetchVoterListAndSetSummary()
        }, [])
    );

    return(
        <AppContainer style={styles.AppContainer}>
             <AppPicker onSelectData={onSummaryTypeChange} value={pickerValue} style={{width:'100%'}} data={SummaryPickerData}/>
             {pickerValue === 'AC Wise Summary' ? 
             null
            :pickerValue === 'Booth Wise Summary' && boothList.length > 0 ?
            <View style={{width:'100%',marginTop:20}}>  
                <AppText>Select Booth No.</AppText>
                <AppPicker onSelectData={onBoothTypeChange} value={boothListValue} style={{width:'100%'}} data={boothList}/>
            </View>:
            pickerValue === 'Cast Wise Summary' ?  
            <View style={{width:'100%',marginTop:20}}> 
                 <AppText>Select Cast</AppText>
                 <AppPicker onSelectData={onCastChange} value={casteValue} style={{width:'100%'}} data={eCast}/> 
            </View>
            :
            pickerValue === 'Color Wise Summary' ? 
            <View style={{width:'100%',marginTop:20}}>
                <AppText>Select Color(Voter's Mood)</AppText>
                <AppPicker onSelectData={onVoterMoodsChange} value={moodValue} style={{width:'100%'}} data={votersMood}/> 
            </View> 
            :
            null}
            <Summary navigation={navigation} voterList={voterList.length > 0 ? voterList : []}/>
             
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

export default SummaryScreen;
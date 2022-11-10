import React,{useState} from 'react'
import { useFocusEffect } from '@react-navigation/native';
import {View,StyleSheet,TouchableOpacity,Image,ScrollView} from 'react-native'
import VoterSummaryCards from './VoterSummaryCards';
import VoterSummaryPieChart from './VoterSummaryPieChart';

const VoterSummaryComponent = ({navigation,voterList,boothNo}) => {
    const [voterData,setVoterData] = useState(null);
    const widthAndHeight = 100
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#ffc4bd','#ff6961'];
    useFocusEffect(
        React.useCallback(() => {
            setVoterData(voterList);
            console.log("From Summary",voterList);
        },[voterList])
    )
    return (
        voterData ? 
        <>
            <ScrollView style={{width: '100%'}}>
                <VoterSummaryCards voterData={voterData} />
                
                {voterData.TOTAL > 0 || voterData.TOTAL_VOTED > 0 ? 
                 <VoterSummaryPieChart label="Pie Chart (Total Voters)" boothNo={boothNo} totalVoters = {voterData.TOTAL} totalVoted = {voterData.TOTAL_VOTED} navigation = {navigation} />
                :
                null}

                {voterData.MALE > 0 || voterData.VOTED_MALE > 0 ? 
                <VoterSummaryPieChart label="Pie Chart (Male)" sex="M" boothNo={boothNo} totalVoters = {voterData.MALE} totalVoted = {voterData.VOTED_MALE} navigation = {navigation} />
                :
                null}

                {voterData.FEMALE > 0 || voterData.VOTED_FMALE > 0 ? 
                <VoterSummaryPieChart label="Pie Chart (Female)" sex="F" boothNo={boothNo} totalVoters = {voterData.FEMALE} totalVoted = {voterData.VOTED_FMALE} navigation = {navigation} />
                :
                null}

                {voterData.OTH > 0 || voterData.VOTED_OTH > 0 ? 
                <VoterSummaryPieChart label="Pie Chart (Others)" sex="O" boothNo={boothNo} totalVoters = {voterData.OTH} totalVoted = {voterData.VOTED_OTH} navigation = {navigation} />
                :
                null}
                               
            </ScrollView>
        </>
        : 
        null 
    )
}

const styles = StyleSheet.create({
    AppContainer:{
        alignItems:'flex-start',
        padding:10
    },
    TableContainer:{
        width:'100%',
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

export default VoterSummaryComponent
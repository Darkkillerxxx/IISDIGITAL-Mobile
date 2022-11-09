import React,{useState} from 'react'
import { useFocusEffect } from '@react-navigation/native';
import {View,StyleSheet,TouchableOpacity,Image,ScrollView} from 'react-native'
import VoterSummaryCards from './VoterSummaryCards';
import VoterSummaryPieChart from './VoterSummaryPieChart';

const VoterSummaryComponent = ({navigation,voterList}) => {
    const [voterData,setVoterData] = useState([]);
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
                <VoterSummaryPieChart label="Pie Chart (Total Voters)" totalVoters = {voterData.TOTAL} totalVoted = {voterData.TOTAL_VOTED} navigation = {navigation} />
                <VoterSummaryPieChart label="Pie Chart (Male)" totalVoters = {voterData.MALE} totalVoted = {voterData.VOTED_MALE} navigation = {navigation} />
                <VoterSummaryPieChart label="Pie Chart (Female)" totalVoters = {voterData.FEMALE} totalVoted = {voterData.VOTED_FMALE} navigation = {navigation} />
                <VoterSummaryPieChart label="Pie Chart (Others)" totalVoters = {voterData.OTH} totalVoted = {voterData.VOTED_OTH} navigation = {navigation} />
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
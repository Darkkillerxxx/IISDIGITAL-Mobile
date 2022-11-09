import React,{useState} from 'react'
import { useFocusEffect } from '@react-navigation/native';
import {View,StyleSheet,TouchableOpacity,Image,ScrollView} from 'react-native'
import AppTextBold from './AppTextBold';
import AppText from './AppText';
import PieChart from 'react-native-pie-chart';

const VoterSummaryPieChart = ({label,totalVoters,totalVoted,navigation}) =>{
    const widthAndHeight = 100
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#ffc4bd','#ff6961'];
    return(
            <>
            <View style={{marginTop:25,width:'100%',height:350,justifyContent:'center',alignItems:'center',elevation:3,borderWidth:1,padding:10}}>
                <View style={{width:'100%',justifyContent:'center',alignItems:'center',padding:10}}>
                    <AppText style={styles.title}>{label}</AppText>
                </View>
                <PieChart
                        widthAndHeight={200}
                        series={[totalVoted,(totalVoters - totalVoted)]}
                        sliceColor={sliceColor}
                        doughnut={true}
                        coverRadius={0.45}
                        coverFill={'#FFF'}
                />

                <View style={{width:'100%',justifyContent:'space-around',marginTop:25,flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>navigation.navigate('SearchVoterScreen',{voters:JSON.stringify(maleVoters)})} style={{width:'30%',flexDirection:'row',justifyContent:'center'}}>
                        <View style={{width:35,height:35,backgroundColor:'#ffc4bd'}} />
                        <View style={{marginLeft:10}}>
                            <AppText>Voted</AppText>
                            <AppTextBold>{parseFloat((totalVoted / totalVoters)*100).toFixed(2)} %</AppTextBold>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>navigation.navigate('SearchVoterScreen',{voters:JSON.stringify(femaleVoters)})} style={{width:'30%',flexDirection:'row'}}>
                        <View style={{width:35,height:35,backgroundColor:'#ff6961'}} />
                        <View style={{marginLeft:10}}>
                            <AppText>Not Voted</AppText>
                            <AppTextBold>{parseFloat(((totalVoters - totalVoted) / totalVoters)*100).toFixed(2)} %</AppTextBold>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
           </>
    )
}

const styles = StyleSheet.create({
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

export default VoterSummaryPieChart
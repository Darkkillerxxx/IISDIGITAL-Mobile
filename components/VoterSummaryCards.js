import React,{useState} from 'react'
import { useFocusEffect } from '@react-navigation/native';
import {View,StyleSheet,TouchableOpacity,Image,ScrollView} from 'react-native'
import AppTextBold from './AppTextBold';
import AppText from './AppText';


const VoterSummaryCards = ({voterData}) =>{
    return(
        voterData ? 
            <>
            <View style={{...styles.TableContainer,...{justifyContent:'space-between'}}}>
               <View style={{width: '48%', height:175,elevation: 2,padding:10,borderWidth:1}}>
                   <View style={{width:'100%',alignItems: 'center'}}>
                       <Image source={require('../assets/images/male.png')} style={{width:50,height:50,marginBottom:10}}/>
                       <AppTextBold>Male Voters</AppTextBold>
                       <AppText>Total : <AppTextBold>{voterData.MALE}</AppTextBold></AppText>
                   </View>
                   <View style={{width:'100%',flexDirection:'row',flex:1,padding:5,marginTop:5}}>
                       <View style={{width:'50%',borderRightWidth:1,alignItems: 'center'}}>
                           <AppText>Voted</AppText>
                           <AppTextBold style={{marginTop:5}}>{voterData.VOTED_MALE}</AppTextBold>
                       </View>
                       <View style={{width:'50%',alignItems: 'center'}}>
                           <AppText>Not Voted</AppText>
                           <AppTextBold style={{marginTop:5}}>{voterData.MALE - voterData.VOTED_MALE}</AppTextBold>
                       </View>
                   </View>
               </View>
               <View style={{width: '48%', height:175,elevation: 2,padding:10,borderWidth:1}}>
                   <View style={{width:'100%',alignItems: 'center'}}>
                       <Image source={require('../assets/images/female.png')} style={{width:50,height:50,marginBottom:10}}/>
                       <AppTextBold>Female Voters</AppTextBold>
                       <AppText>Total : <AppTextBold>{voterData.FEMALE}</AppTextBold></AppText>
                   </View>
                   <View style={{width:'100%',flexDirection:'row',flex:1,padding:5,marginTop:5}}>
                       <View style={{width:'50%',borderRightWidth:1,alignItems: 'center'}}>
                           <AppText>Voted</AppText>
                           <AppTextBold style={{marginTop:5}}>{voterData.VOTED_FMALE}</AppTextBold>
                       </View>
                       <View style={{width:'50%',alignItems: 'center'}}>
                           <AppText>Not Voted</AppText>
                           <AppTextBold style={{marginTop:5}}>{voterData.FEMALE - voterData.VOTED_FMALE}</AppTextBold>
                       </View>
                   </View>
               </View>
           </View>
           <View style={{...styles.TableContainer,...{justifyContent:'space-between'}}}>
               <View style={{width: '48%', height:175,elevation: 2,padding:10,borderWidth:1}}>
                   <View style={{width:'100%',alignItems: 'center'}}>
                       <Image source={require('../assets/images/ellipsis.png')} style={{width:50,height:50,marginBottom:10}}/>
                       <AppTextBold>Other Voters</AppTextBold>
                       <AppText>Total : <AppTextBold>{voterData.OTH}</AppTextBold></AppText>
                   </View>
                   <View style={{width:'100%',flexDirection:'row',flex:1,padding:5,marginTop:5}}>
                       <View style={{width:'50%',borderRightWidth:1,alignItems: 'center'}}>
                           <AppText>Voted</AppText>
                           <AppTextBold style={{marginTop:5}}>{voterData.VOTED_OTH}</AppTextBold>
                       </View>
                       <View style={{width:'50%',alignItems: 'center'}}>
                           <AppText>Not Voted</AppText>
                           <AppTextBold style={{marginTop:5}}>{voterData.OTH - voterData.VOTED_OTH}</AppTextBold>
                       </View>
                   </View>
               </View>
               <View style={{width: '48%', height:175,elevation: 2,padding:10,borderWidth:1}}>
                   <View style={{width:'100%',alignItems: 'center'}}>
                       <Image source={require('../assets/images/sigma.png')} style={{width:50,height:50,marginBottom:10}}/>
                       <AppTextBold>Total Voters</AppTextBold>
                       <AppText>Total : <AppTextBold>{voterData.TOTAL}</AppTextBold></AppText>
                   </View>
                   <View style={{width:'100%',flexDirection:'row',flex:1,padding:5,marginTop:5}}>
                       <View style={{width:'50%',borderRightWidth:1,alignItems: 'center'}}>
                           <AppText>Voted</AppText>
                           <AppTextBold style={{marginTop:5}}>{voterData.TOTAL_VOTED}</AppTextBold>
                       </View>
                       <View style={{width:'50%',alignItems: 'center'}}>
                           <AppText>Not Voted</AppText>
                           <AppTextBold style={{marginTop:5}}>{voterData.TOTAL - voterData.TOTAL_VOTED}</AppTextBold>
                       </View>
                   </View>
               </View>
           </View>
           </>
        : null
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

export default VoterSummaryCards
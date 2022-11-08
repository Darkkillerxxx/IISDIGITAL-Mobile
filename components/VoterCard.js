import React from 'react'
import {StyleSheet,TouchableOpacity,View,Image} from 'react-native'
import AppCard from '../components/AppCard';
import AppText from '../components/AppText';
import AppTextBold from '../components/AppTextBold';

const VoterCard = ({item,index,onVoterCardPress}) => {
    return(
        <TouchableOpacity key={index} onPress={()=> onVoterCardPress(item)}>    
                <AppCard style={{...styles.AppCard,...{borderRightColor:item.COLORCODE === "1" ? "#2ab574":item.COLORCODE === "2" ? "#f5bb18":item.COLORCODE === "3" ? "#ff6961":'white'}}}>
                    <View style={{width:'100%',padding:12}}>
                        <View style={styles.AppCardDetails}>
                            <View style={styles.AppCardRow}>
                                <View style={{...styles.AppCardRowDivision,width:'50%'}}>
                                    <AppText style={styles.AppCardRowDivisionAppText}>Name</AppText>
                                    <AppTextBold style={styles.AppCardRowDivisionAppBoldText}>{`${item.F_NAME && item.F_NAME !== 'null'? item.F_NAME:''} ${item.M_NAME && item.M_NAME !== 'null' ? item.M_NAME : ''} ${item.SURNAME && item.SURNAME !== 'null' ? item.SURNAME : '' }`}</AppTextBold>
                                </View>
                                <View style={{...styles.AppCardRowDivision,width:'25%'}}>
                                    <AppText style={styles.AppCardRowDivisionAppText}>SL No.</AppText>
                                    <AppTextBold style={styles.AppCardRowDivisionAppBoldText}>{item?.SL_NO}</AppTextBold>
                                </View>
                                <View style={{...styles.AppCardRowDivision,width:'25%'}}>
                                    <AppText style={styles.AppCardRowDivisionAppText}>Booth No.</AppText>
                                    <AppTextBold style={styles.AppCardRowDivisionAppBoldText}>{item?.SL_NO}</AppTextBold>
                                </View>
                            </View>
                            <View style={styles.AppCardRow}>
                                <View style={styles.AppCardRowDivision}>
                                    <AppText style={styles.AppCardRowDivisionAppText}>Contact No</AppText>
                                    <AppTextBold style={styles.AppCardRowDivisionAppBoldText}>{`${item.CONTACTNO && item.CONTACTNO !== 'null' ? item.CONTACTNO:''}`}</AppTextBold>
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
    )
}

const styles = StyleSheet.create({
    AppContainer:{
        alignItems:'flex-start',
        padding:10
    },
    SignInInput:{
        width:'65%',
        backgroundColor:'white'
    },
    SearchFilterContainer:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:10
    },
    //////////
    AppCard:{
        width:'100%',
        backgroundColor:'white',
        borderRadius:5,
        height:85,
        padding:5,
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
    AppCardRowDivision:{
        alignItems:'flex-start',
        justifyContent:'flex-start',
        width:'50%'
    },
})

export default VoterCard;
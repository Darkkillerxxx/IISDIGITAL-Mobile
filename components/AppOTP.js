import React,{useEffect,useState,useRef} from 'react';
import { Text, View,StyleSheet,TextInput,Image,TouchableOpacity } from 'react-native';
import AppContainer from './AppContainer';
import AppInput from './AppInput';
import AppText from './AppText';
import {colors} from '../utils/utils'
import AppButton from './AppButton';


const AppOtp = ({setOTPFromComponent}) =>{
    const [otp,setOTP] = useState(['','','',''])
    const ref_input2 = useRef();
    const ref_input3 = useRef();
    const ref_input4 = useRef();

    const onOTPChange = (e,index) =>{
        let tempOtp = otp;
        tempOtp[index] = e
        switch(index){
            case 0:
                if(tempOtp[0].length > 0){
                    ref_input2.current.focus()
                }
            case 1:
                if(tempOtp[1].length > 0){
                    ref_input3.current.focus()
                }
            case 2:
                if(tempOtp[2].length > 0){
                    ref_input4.current.focus()
                }
        }
        console.log(tempOtp)
        setOTPFromComponent(tempOtp.toString().replace(/,/g,''));
        setOTP([...tempOtp])
    }

    const onSubmitOTP=()=>{
        navigation.navigate('Login')
    }

    return(
            <View style={styles.OTPContainer}>
                <View style={styles.OTPInput}>
                    <TextInput textAlign={'center'} onChangeText={(e)=> onOTPChange(e,0)} blurOnSubmit={false} keyboardType="numeric" style={{width:'100%'}}/>
                </View>
                <View style={styles.OTPInput}>
                    <TextInput textAlign={'center'} ref={ref_input2} onChangeText={(e)=> onOTPChange(e,1)} blurOnSubmit={false} style={{width:'100%'}} keyboardType="numeric"/>
                </View>
                <View style={styles.OTPInput}>
                    <TextInput textAlign={'center'} ref={ref_input3} onChangeText={(e)=> onOTPChange(e,2)} blurOnSubmit={false} style={{width:'100%'}} keyboardType="numeric"/>
                </View>
                <View style={styles.OTPInput}>
                    <TextInput textAlign={'center'} ref={ref_input4} onChangeText={(e)=> onOTPChange(e,3)} blurOnSubmit={false} style={{width:'100%'}} keyboardType="numeric"/>
                </View>
            </View>
    );
} 

const styles = StyleSheet.create({
    AppContainer:{
        alignItems:'flex-start',
        justifyContent:'flex-start',
        paddingTop:50
    },
    OTPContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'100%',
        paddingHorizontal:25
    },
    OTPInput:{
        width:'15%',
        borderColor:'black',
        borderWidth:1,
        borderRadius:5,
        marginHorizontal:10
    },
    loginTextContainer:{
        marginBottom:50,
        marginTop:25
    },
    logoContainer:{
        width:'50%',
        alignItems:'center',
        justifyContent:'center'
    },
    logo:{
        width:125,
        height:125,
        resizeMode:'contain'
    },
    OTPText:{
        fontSize:24,
        fontWeight:'bold',
        marginLeft:25
    },
    OTPResendContainer:{
        width:'100%',
        justifyContent: 'center',
        alignItems:'center',
        marginTop:15
    },
    SubmitButtonContainer:{
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        marginVertical:25
    }
});

export default AppOtp;

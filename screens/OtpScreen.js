import React,{useState,useContext} from 'react'
import { View,StyleSheet,Image,TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from "../context/AuthContext";
import AppContainer from '../components/AppContainer'
import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import AppOtp from '../components/AppOTP'
import { colors } from '../utils/utils'
import { apiCall } from '../Services';

const OtpScreen = ({route,navigation}) =>{
    const [otp,setOTP] = useState('')
    const [errMessage,setErrMessage] = useState('')
    const [activityIndicatorValue,setActivityIndicatorValue] = useState(false)
    const {isLoggedIn,setIsLoggedIn} = useContext(AuthContext)

    const onSubmitOTP = async() =>{
        setActivityIndicatorValue(true)
        let otpRequestObj = {
            mobile:route.params.mobile,
            otp:parseInt(otp)
        }
        console.log(20,otpRequestObj);
        let otpResponse = await apiCall('post','verifyOtp',otpRequestObj);
        console.log(24,otpResponse)
        if(otpResponse.status === 200){
            console.log(282828,'Login Successfull');
            await AsyncStorage.setItem('authToken',otpResponse.token);
            await AsyncStorage.setItem('userData',JSON.stringify(otpResponse.userData[0]))

            console.log(323232,await AsyncStorage.getItem('authToken'))
            console.log(333333,await AsyncStorage.getItem('userData'))
            setErrMessage('')
            setIsLoggedIn(true)
        }
        else{
            setErrMessage(otpResponse.msg)
        }
        setActivityIndicatorValue(false)
    }

    const setOTPValue = (otp) =>{
        setOTP(otp)
    }

    return(
        <AppContainer style={styles.AppContainer}>
            <View style={styles.OTPTextContainer}>
                {/* <View style={styles.ImageContainer}>
                    <Image style={styles.Logo} 
                            source={require('../assets/images/bjp-nobacklogo.png')}
                    />
                </View> */}
                <AppText style={styles.OTPText}>Verify Its You !</AppText>
                <AppText style={{...styles.OTPText,...{fontSize:14,fontWeight:'normal',marginTop:10}}}>Pelase Enter the Otp You Received On Your Mobile</AppText>
            </View>
            
            {errMessage.length > 0 ? 
                <AppText style={{fontSize:14,color:'red',marginLeft:25,marginBottom:10,marginTop:0}}>{errMessage}</AppText>
                :
                null
            }
            
            <AppOtp setOTPFromComponent={setOTPValue}/>

            <View style={styles.SubmitButtonContainer}>
                <AppButton onPressButton = {onSubmitOTP} showActivityIndicator={activityIndicatorValue} icon='log-out-outline' iconColor='white' iconSize={24} text="Verify OTP" textStyle={{fontSize:18}} buttonStyle={{marginTop:10,backgroundColor:colors.primary,width:'90%'}}  /> 
            </View>
           
            <View style={styles.OTPResendContainer}>
                <AppText style={{fontSize:14,flexDirection:'row'}}>Not Received OTP ?  
                    <TouchableOpacity onPress={()=>{}} style={{left:10}}>
                        <AppText style={{left:10,top:5,fontSize:16,fontWeight:'bold',color:'black'}}>
                            Click Here To Resend.
                        </AppText>
                    </TouchableOpacity>
                </AppText>
            </View>
        </AppContainer>
    )
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
    OTPTextContainer:{
        marginBottom:25,
        marginTop:25
    },
    logoContainer:{
        width:'50%',
        alignItems:'center',
        justifyContent:'center'
    },
    logo:{
        width:150,
        height:50,
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
    },
    ImageContainer:{
        width:'100%',
        justifyContent:'flex-start',
        alignItems:'flex-start'
    },
    Logo:{
        width:170,
        height:170
    }
});

export default OtpScreen;
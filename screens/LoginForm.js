import React,{useState,useContext} from "react";
import {View,Image,StyleSheet} from 'react-native'
import AppContainer from "../components/AppContainer";
import AppInput from "../components/AppInput";
import AppText from "../components/AppText";
import AppTextBold from "../components/AppTextBold";
import AppButton from "../components/AppButton";
import { apiCall } from "../Services";
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from "../context/AuthContext";

const LoginForm = ({changeLoginStatus,navigation}) =>{
    const [usernameOrMobile,setUsernameOrMobile] = useState('');
    const [password,setPassword] = useState('');
    const [validationErr,setValidationErr] = useState(null);
    const [activityIndicatorValue,setActivityIndicatorValue] = useState(false)
    const {isLoggedIn,setIsLoggedIn} = useContext(AuthContext)
    

    console.log(changeLoginStatus,navigation)
    const validation = () =>{
        if(usernameOrMobile.length === 0){
            setValidationErr('Username or Mobile Empty or Invalid')
            return false;
        }
        return true
    }

    const onLoginClicked =async() => {
        setActivityIndicatorValue(true)
        if(validation()){
            setValidationErr(null)
            let loginRequestObj = {
                usernameOrMobile:usernameOrMobile
            }
            console.log(loginRequestObj)
           let loginResponse = await apiCall('post','usersLogin',loginRequestObj);
            console.log(45555,loginResponse)
           if(loginResponse.status === 200){
                // Change these Lines after OTP flow has been introduced
                // await AsyncStorage.setItem('authToken',loginResponse.token);
                // await AsyncStorage.setItem('userData',JSON.stringify(loginResponse.userData[0]))
                navigation.navigate('OTP',{mobile:loginResponse.mobile});
           }
           else{
            setValidationErr(JSON.stringify(loginResponse.msg));
           }
           
        }
        setActivityIndicatorValue(false)
       
    }

    return(
        <AppContainer style={styles.LoginContainer}>
            <View style={styles.ImageContainer}>
                <Image style={styles.Logo} 
                       source={require('../assets/images/bjp-nobacklogo.png')}
                />
            </View>
            <AppTextBold style={styles.WelcomeAgainText}>Welcome again!</AppTextBold>
            <AppText>Please sign in to continue</AppText>

            {validationErr ? 
                <AppText style={styles.ValidationErrMsg}>
                {validationErr}
                </AppText>:
            null}

            <AppInput
                icon={'md-person'}
                hasIcon={true} 
                style={styles.SignInInput}
                placeholderText="Enter Your Username or Mobile No"
                onTextChange={setUsernameOrMobile}/>

            <AppButton 
                iconColor='white' 
                iconSize={24} 
                text="Send OTP" 
                textStyle={{fontSize:18}}
                onPressButton={onLoginClicked}
                showActivityIndicator = {activityIndicatorValue} 
                buttonStyle={{marginTop:10,backgroundColor:'#f49d34',width:'100%'}}  />
        </AppContainer>
    )
}

const styles = StyleSheet.create({
    LoginContainer:{
        padding:25,
        justifyContent:'center',
        alignItems:'flex-start'
    },
    ValidationErrMsg:{
        color:'red',
        marginVertical:10
    },
    ImageContainer:{
        width:'100%',
        justifyContent:'flex-start',
        alignItems:'flex-start'
    },
    Logo:{
        width:175,
        height:175
    },
    SignInInput:{
        flexDirection:'row',
        justifyContent: 'space-between',
        paddingHorizontal:10,
        marginTop:15,
        marginBottom:10
    },
    WelcomeAgainText:{
        fontSize:20,
        marginBottom:10
    }
})

export default LoginForm;
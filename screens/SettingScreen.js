import React,{useState,useEffect,useContext} from "react";
import {StyleSheet,View,TouchableOpacity,ToastAndroid,Alert} from 'react-native'
import AppContainer from "../components/AppContainer";
import AppTextBold from "../components/AppTextBold";
import Icon from 'react-native-vector-icons/Ionicons';
import AppText from "../components/AppText";
import Settings from "../static/SettingContent.json"
import AsyncStorage from "@react-native-community/async-storage";
import { AuthContext } from "../context/AuthContext";

const SettingScreen = ()=> {
    const [settingContents,setSettingContents] = useState([...Settings.SettingContent])
    const {isLoggedIn,setIsLoggedIn} = useContext(AuthContext)

    useEffect(()=>{
        settingContents?.forEach((settingContent)=>{
            switch (settingContent.name) {
                case "Profile Details":
                    settingContent.onClick = ()=> {onProfileDetailsPress();}
                    break;
                
                case "Language":
                    settingContent.onClick = () =>{ onLanguagePress();}
                    break;
                

                default:
                    settingContent.onClick = () => {onLogOutPressed();}    
                    break;
            }
        })

        setSettingContents([...settingContents])
    },[])

    const onProfileDetailsPress = () =>{
        ToastAndroid.showWithGravityAndOffset("Comming Soon",ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
    }

    const onLanguagePress = ()=>{
        ToastAndroid.showWithGravityAndOffset("Comming Soon",ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
    }

    const onLogOutConfirmed = async()=>{
        await AsyncStorage.clear()
        setIsLoggedIn(false)
    }

    const onLogOutPressed=()=>{
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out ?",
            [
              {
                text: "Yes",
                onPress: () => onLogOutConfirmed()
              },
              { 
                text: "No", 
                onPress: () => {}
              }
            ]
          );
    }

    return(
        <AppContainer style={styles.AppContainer}>
            <AppTextBold style={styles.HeaderBoldText}>App Settings</AppTextBold>
            
                <View style={styles.SettingsContentContainer}>
                    {
                        settingContents.map((settingContent)=>{
                            return(
                            <TouchableOpacity onPress={()=>settingContent.onClick()}>
                                 <View id={settingContent.title} style={styles.SettingContentCard}>
                                    <View style={styles.SettingIconContainer}>
                                        <Icon name={settingContent.icon} size={24} color="white" /> 
                                    </View>

                                    <View style={styles.SettingsContent}>
                                        <AppText style={styles.SettingContentText}>{settingContent.title}</AppText>
                                    </View>
                                </View>
                            </TouchableOpacity>
                           
                            )
                        })
                    }
                </View>    
        </AppContainer>
    )
}


const styles = StyleSheet.create({
    AppContainer:{
        padding:10
    },
    HeaderBoldText:{
        fontSize:18
    },
    SettingsContentContainer:{
        flex:1,
        width:'100%'
    },
    SettingContentCard:{
        height:40,
        marginTop:15,
        marginBottom:10,
        flexDirection:'row',
        justifyContent:'space-around'
    },
    SettingIconContainer:{
        width:'12%',
        height:45,
        borderRadius:10,
        backgroundColor:'#f49d34',
        alignItems:'center',
        justifyContent:'center'
    },
    SettingsContent:{
        width:'80%',
        height:50,
        borderBottomWidth:1,
        borderColor:'#dfe2e7',
        justifyContent:'center'
    },
    SettingContentText:{
        fontWeight:"600",
        marginLeft:5
    }
})


export default SettingScreen
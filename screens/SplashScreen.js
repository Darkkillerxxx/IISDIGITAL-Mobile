import React from "react";
import {StyleSheet,View,Text,Image} from 'react-native'
import AppContainer from "../components/AppContainer";
import * as Animatable from 'react-native-animatable';

const SplashScreen = ()=>{
    return(
        <AppContainer>
            <View style={styles.SplashScreenLogoContainer}>
                <Animatable.Image 
                        style={styles.SplashScreenLogo} 
                        source={require('../assets/images/bjp-nobacklogo.png')}
                        animation="pulse" 
                        easing="ease-out" 
                        iterationCount="infinite"
                />
            </View>
            <View style={styles.VersionContainer}>
                <Text>v 1.0.1</Text>
            </View>
        </AppContainer>
    )
}


const styles = StyleSheet.create({
  SplashScreenLogoContainer:{
        height:'95%',
        width:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    VersionContainer:{
        width:'100%',
        height:'5%',
        justifyContent:'flex-end',
        alignItems:'flex-start'
    },
    SplashScreenLogo:{
        width:175,
        height:175
    }
})

export default SplashScreen;
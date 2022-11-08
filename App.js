/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React,{useState,useEffect} from 'react';
 import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   useColorScheme,
   View,
 } from 'react-native';
 import {apiCall, checkToken, makeDatabaseTransactions} from './Services'
 import SplashScreen from './screens/SplashScreen';
 import LoginForm from './screens/LoginForm';
 import OtpScreen from './screens/OtpScreen';
 //import {bottomNavigator} from './Constants'
 import PostAuthScreen from './Navigator/PostAuthScreen';
 import PreAuthScreen from './Navigator/PreAuthScreen';
 import bottomNavigator from './static/BottomNavigator.json'
 import AsyncStorage from '@react-native-community/async-storage';
 import NetInfo from "@react-native-community/netinfo"; 
 import {AuthContext} from './context/AuthContext'

 
 const App = () => {
   const [showSplashScreen,setShowSplashScreen] = useState(true)
   const [isLoggedIn,setIsLoggedIn] = useState(false);
   const [visitScreenFilter,setVisitScreenFilter] = useState({acNo:null,boothNo:null,vibhagNo:null,houseNo:null,search:null});
   useEffect(()=>{
     console.log(77777777,visitScreenFilter)
     async function validateToken(){
       let isValidToken = await checkToken();
       setShowSplashScreen(false);
       setIsLoggedIn(isValidToken);
       if(isValidToken){
         syncData();
       }
     }
     validateToken();
   },[isLoggedIn,visitScreenFilter])
 
   const syncData = async() => {
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
    console.log(48,userData)
    let selectedAccNo = userData.accNo;


    /******************************************************
      Fetching boothlist against a AccNO
    *********************************************************/

    let boothlistPayload = {
      boothNos:userData.assignedBooths
    }

    let societylistsArr = []
    
    let votersListArr = []
    
    let boothListsResponse = await apiCall('post','getBoothListForUsers',boothlistPayload);
    
    await AsyncStorage.setItem('boothList',JSON.stringify(boothListsResponse.boothList));
    
    //Temp fix change Later
    boothListsResponse.boothList.forEach((booth,index) => {
      societylistsArr.push({
        acNo:booth.AC_NO,
        stCode:booth.ST_CODE,
        boothNo:booth.BOOTH_NO
      })
    })
    
    /********************************************************
     Fetching Society List against a AccNO,BoothNo AND STCODE
     ********************************************************/

    let societyListsResponse = await apiCall('post','getSocietyList',{values:societylistsArr});
    // console.log(81,societylistsArr)
    // console.log(8282,JSON.stringify(societyListsResponse));
    await AsyncStorage.setItem('societyList',JSON.stringify(societyListsResponse.societyList));

    let lastVoterListSync = await AsyncStorage.getItem('lastVoterListSync');

    societyListsResponse.societyList.forEach((society,index) => {
      votersListArr.push({
        acNo:society.AC_NO,
        stCode:society.ST_CODE,
        boothNo:society.BOOTH_NO,
        vibhagNo:society.VIBHAG_NO
      })
    })

  
    /********************************************************
     Fetching Voters List against AccNO,BoothNo,STCODE,VibhagNo
     ********************************************************/
    // console.log('Calling now',votersListArr)
     let votersListResponse = await apiCall('post','getVoterList',{values:votersListArr});
     
     console.log(103103,votersListResponse.voterList.length)
     if(votersListResponse.status === 200){
      makeDatabaseTransactions('VoterList',votersListResponse.voterList)
      
      console.log('All Set');
     }     
  }
 
   const onChangeLoginStatus = (status) =>{
     setIsLoggedIn(status);
     syncData();
   }
 
   return (
     <AuthContext.Provider value={{isLoggedIn,setIsLoggedIn,visitScreenFilter,setVisitScreenFilter}}>
       {
          showSplashScreen ? 
          <SplashScreen/>
          : 
          isLoggedIn ? 
            <PostAuthScreen bottomNavigator={bottomNavigator.BottomNavigator}/> 
          :
            <PreAuthScreen /> 
       }
     </AuthContext.Provider>
    
   );
 };
 
 const styles = StyleSheet.create({
   sectionContainer: {
     marginTop: 32,
     paddingHorizontal: 24,
   },
   sectionTitle: {
     fontSize: 24,
     fontWeight: '600',
   },
   sectionDescription: {
     marginTop: 8,
     fontSize: 18,
     fontWeight: '400',
   },
   highlight: {
     fontWeight: '700',
   },
 });
 
 export default App;
 
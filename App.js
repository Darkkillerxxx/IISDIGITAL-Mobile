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
   ActivityIndicator
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
import AppText from './components/AppText';

 
 const App = () => {
   const [showSplashScreen,setShowSplashScreen] = useState(true)
   const [isLoggedIn,setIsLoggedIn] = useState(false);
   const [isSyncing,setIsSyncing] = useState(false);
   const [visitScreenFilter,setVisitScreenFilter] = useState({acNo:null,boothNo:null,vibhagNo:null,houseNo:null,search:null});
   useEffect(()=>{
     console.log(77777777,visitScreenFilter)
     async function validateToken(){
       let isValidToken = await checkToken();
       setShowSplashScreen(false);
       setIsLoggedIn(isValidToken);
       if(isValidToken){
        NetInfo.fetch().then((state)=>{
          if(state.isConnected){
            syncData();
          }
        })
       }
     }
     validateToken();
   },[isLoggedIn,visitScreenFilter])
 
   const syncData = async() => {
    setIsSyncing(true);
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
        boothNo:society.BOOTH_NO
      })
    })

  
    /********************************************************
     Fetching Voters List against AccNO,BoothNo,STCODE,VibhagNo
     ********************************************************/
     let votersListResponse = await apiCall('post','getVoterList',{values:votersListArr});
     
     console.log(103103,votersListResponse.voterList.length)
     if(votersListResponse.status === 200){
      makeDatabaseTransactions('VoterList',votersListResponse.voterList)
      
      console.log('All Set');
     }
     setIsSyncing(false);     
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
            <View style={{width:'100%',flex:1}}>
              {isSyncing ?
              <View style={{width:'100%',height:50,justifyContent:'center',alignItems: 'center',flexDirection:'row',backgroundColor:'orange'}}>
                <ActivityIndicator size="small" color="white" />
                <AppText style={{marginLeft:15,color:'white'}}>Syncing Data...</AppText>
              </View>
              :
              null}
              
              <PostAuthScreen bottomNavigator={bottomNavigator.BottomNavigator}/> 
            </View> 
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
 
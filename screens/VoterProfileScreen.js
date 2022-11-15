import React,{useState,useEffect} from "react";
import {StyleSheet,View,Image,ScrollView,ActivityIndicator,FlatList,Modal,TouchableOpacity,ToastAndroid,Alert,Linking} from 'react-native'
import NetInfo from "@react-native-community/netinfo"; 
import AppButton from "../components/AppButton";
import AppContainer from '../components/AppContainer'
import AppInput from '../components/AppInput'
import AppText from "../components/AppText";
import AppCard from "../components/AppCard";
import AppTextBold from '../components/AppTextBold'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-community/async-storage";
import AddMemberModal from "../components/AddMemberModal";
import LinkMemberModule from "../components/LinkMemberModule";
import AppPicker from "../components/AppPicker";
import AppCollapsibleCards from '../components/AppCollapsibleCards'
import DateTimePicker from '@react-native-community/datetimepicker';
import {bloodGroup,votersMood,rationCard,eCast,PPCC} from '../utils/utils';
import ImagePicker from 'react-native-image-crop-picker';
import { apiCall,fetchAllDataFromTable,makeDatabaseTransactions } from "../Services";
import ShareImagePreview from "../components/ShareImagePreview";
import SearchablePicker from "../components/SearchablePicker";
import axios from "axios"
import moment from "moment";

const VoterProfileScreen = ({route,navigation}) =>{
    
    const [profileDetails,setProfileDetails] = useState(null);
    const [showDOBPicker,setShowDOBPicker] = useState(false);
    const [showMarriagePicker,setShowMarriagePicker] = useState(false);
    const [profilePicBase64,setProfilePicBase64] = useState(null);
    const [showFamilyLinkModal,setShowFamilyLinkModal] = useState(false);
    const [showSearchablePicker,setShowSearchablePicker] = useState(false);
    const [isLoading,setIsLoading] = useState(false)
    const [showSharePreview,setShowSharePreview] = useState(false)
    const [isVoted,setIsVoted] = useState(false);

    useEffect(()=>{
        let profileDetails = JSON.parse(route.params.voter); 
        setProfileDetails({...profileDetails});
        setIsVoted(profileDetails.VOTED); 
        console.log(31,profileDetails);
    },[])

    const changeProfileDetailsValue = (key,value) =>{
        console.log(key,value)
        let profileData = profileDetails;
        profileData[key] = value;
        setProfileDetails({...profileData})
        if(key === 'VOTED'){
            onSaveDetails();   
        }
    }

    const onDateChange = (key,event,date) =>{

        setShowDOBPicker(false)
        setShowMarriagePicker(false)

        let profileData = profileDetails;
        profileData[key] = date.toISOString().split('T')[0];
        // if((moment().format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD'))){
        //     profileData[key] = null;
        // }
        // else{
        //     profileData[key] = date.toISOString().split('T')[0];
        // }

        console.log(41,profileData)
        setProfileDetails({...profileData})   
    }


    const onSelectEcast = (ecast) =>{
        changeProfileDetailsValue('eCAST',ecast)
        setShowSearchablePicker(false)
    }

    const sendMessage = async() =>{
        if(profileDetails.CONTACTNO.length > 0){
            let messageTobeSentWithAPI = `http://www.logotech.co.in/autosms/smsapi.php?username=ASRANA&password=ASRANA&sender=ARVNDR&to=${profileDetails.CONTACTNO}&message=Hello ${profileDetails?.F_NAME}, ભારતીય જનતા પાર્ટી, 159- સુરત પૂર્વ વિધાનસભા દ્વારા લોકહિત માટે શરૂ કરેલ યોજનાકીય સર્વે માટે મળેલ આપશ્રીના સહકાર અને સમર્થન બદલ આભાર... -ધારાસભ્ય અરવિંદભાઈ રાણા&route=2&lng=1` 
            
            let response = await axios({
                method: 'GET',
                url: messageTobeSentWithAPI
            })
           console.log(7070,response);
           ToastAndroid.showWithGravityAndOffset("Message Sent Successfully",ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
        }
        else{
            ToastAndroid.showWithGravityAndOffset("Mobile Number Not Set",ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
        }
        
    }

    const onSaveDetails = async() => {
        try{
            setIsLoading(true)
            ToastAndroid.showWithGravityAndOffset("Please Wait Updating Voters....",ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
            console.log(new Date().toISOString())
            let unSyncedVoters = await AsyncStorage.getItem('unSyncedVoters');
            console.log(60,unSyncedVoters);
            if(unSyncedVoters){
                unSyncedVoters = JSON.parse(unSyncedVoters);
            }
            else{
                unSyncedVoters = [];
            }

            let index = unSyncedVoters.findIndex((voter)=> voter.IDCARD_NO === profileDetails.IDCARD_NO);
            
            // console.log(index)
            let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

            let userData = JSON.parse(await AsyncStorage.getItem('userData'));
            profileDetails.LAST_UPD_DT = localISOTime;
            profileDetails.LAST_UPD_ID = userData.id;
            profileDetails.PAGE_NO = profileDetails?.PAGE_NO? parseInt(profileDetails?.PAGE_NO):0;
            profileDetails.FAMILY_ID = `${profileDetails?.AC_NO}_${profileDetails?.BOOTH_NO}_${profileDetails?.SL_NO}`;
            profileDetails.AANAJ =  profileDetails.AANAJ === 'null' || profileDetails.AANAJ === null ? 0 :profileDetails.AANAJ;
            profileDetails.BIRTHDATE = profileDetails.BIRTHDATE === 'null' || profileDetails.BIRTHDATE === null ? '' : moment().format('YYYY-MM-DD') === moment(profileDetails.BIRTHDATE).format('YYYY-MM-DD') ? null : profileDetails.BIRTHDATE; 
            profileDetails.DOM = profileDetails.DOM === 'null' || profileDetails.DOM === null ? '' :profileDetails.DOM; 
            profileDetails.BLOOD_GROUP = profileDetails.BLOOD_GROUP === 'null' || profileDetails.BLOOD_GROUP === null ? '' :profileDetails.BLOOD_GROUP; 
            profileDetails.COLORCODE = profileDetails.COLORCODE === 'null' || profileDetails.COLORCODE === null ? '' :profileDetails.COLORCODE; 
            profileDetails.CONTACTNO = profileDetails.CONTACTNO === 'null' || profileDetails.CONTACTNO === null ? '' :profileDetails.CONTACTNO; 
            profileDetails.CONTACTNO2 = profileDetails.CONTACTNO2 === 'null' || profileDetails.CONTACTNO2 === null ? '' :profileDetails.CONTACTNO2; 
            profileDetails.MA_CARD = profileDetails.MA_CARD === 'null' || profileDetails.MA_CARD === null ? 0 :profileDetails.MA_CARD; 
            profileDetails.SEX = profileDetails.SEX === 'null' || profileDetails.SEX === null ? '' :profileDetails.SEX;
            profileDetails.VACCINATION = profileDetails.VACCINATION === 'null' || profileDetails.VACCINATION === null ? false :profileDetails.VACCINATION;
            profileDetails.eCAST = profileDetails.eCAST === 'null' || profileDetails.eCAST === null ? '' :profileDetails.eCAST;
            profileDetails.isTransfer = profileDetails.isTransfer === 'null' || profileDetails.isTransfer === '' ? 0 :profileDetails.isTransfer;
            profileDetails.ePhoto = profileDetails.ePhoto === 'null' || profileDetails.ePhoto === null ? '' :profileDetails.ePhoto;
            profileDetails.RATION_CARD = profileDetails.RATION_CARD === 'null' || profileDetails.RATION_CARD === null ? 0 :profileDetails.RATION_CARD;
            profileDetails.isDEATH = profileDetails.isDEATH === 'null' || profileDetails.isDEATH === null ? false : profileDetails.isDEATH;
            profileDetails.VOTED = profileDetails.VOTED === 'null' || profileDetails.VOTED === null ? false : profileDetails.VOTED;
    
            if(index >= 0){
                unSyncedVoters[index] = profileDetails
            }
            else{
                unSyncedVoters.push(profileDetails)
            }
            
            await AsyncStorage.setItem('unSyncedVoters',JSON.stringify(unSyncedVoters));
            // await AsyncStorage.removeItem('unSyncedVoters');

            // console.log('Un Synced Voters',await AsyncStorage.getItem('unSyncedVoters'))

            let votersList = [...unSyncedVoters]
            console.log(93,votersList[0])
            unSyncedVoters.forEach(unSyncedVoter => {
                
                let index = votersList.findIndex((voter)=> voter.IDCARD_NO === unSyncedVoter.IDCARD_NO);

                if(index >= 0){
                    votersList[index] = unSyncedVoter;
                }
            });

            console.log(100)
            console.log(105,votersList)
            await makeDatabaseTransactions('VoterList',votersList)

            console.log(114,unSyncedVoters)
            /****Checking if Internet is Present,If not do not make APi call and Store UnSynced Voters, If yes then Make APi call and reset Unsynced Voters */
            let netInformation = await NetInfo.fetch();
        
            if(netInformation.isConnected){
                console.log("updateVoterResponse",{values:unSyncedVoters})
                let updateVoterResponse = await apiCall('post','updateVoter',{values:unSyncedVoters})
            console.log("updateVoterResponse",updateVoterResponse)
                if(updateVoterResponse.status === 200){
                    console.log('Voters Updated Successfully')
                    await AsyncStorage.removeItem('unSyncedVoters');
                    ToastAndroid.showWithGravityAndOffset("Voters Updated Successfully",ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
                }
                else{
                    ToastAndroid.showWithGravityAndOffset(updateVoterResponse.msg.toString(),ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
                    console.log('Error Updating Voters',updateVoterResponse.error)
                }
            }
            else{
                ToastAndroid.showWithGravityAndOffset("Data Stored to Local to Sync Later",ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
            }
            setIsLoading(false)
      }
      catch(e){
            setIsLoading(false)
            ToastAndroid.showWithGravityAndOffset("Error :- " + e,ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
      }
    }

    const onPictureReset = () =>{
        const profileDetailsForResettingPic = profileDetails;
        profileDetailsForResettingPic.ePhoto = null;
        setProfileDetails({...profileDetailsForResettingPic})
    }

    const onSetVotedOrNonVoted = () =>{
         Alert.alert(
            "Vote/Unvoted",
            `Mark this user as ${isVoted ? "Not Voted":"Voted"}`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        { text: "Yes", onPress: () => {
            setIsVoted(!isVoted);
            changeProfileDetailsValue("VOTED",isVoted ? false:true);
        }}
      ]
    );
    }

    const onPictureEditClick = () =>{
        if(profileDetails.ePhoto){
            Alert.alert(
                "Picture Reset",
                "Are you sure you want to reset the profile pic ?",
                [
                  {
                    text: "Yes",
                    onPress: () => onPictureReset()
                  },
                  { 
                    text: "No", 
                    onPress: () => {}
                  }
                ]
              );
        }
        else{
            Alert.alert(
                "Select Picture",
                "Do you want to Open Camera or Gallery ?",
                [
                  {
                    text: "Camera",
                    onPress: () => onOpenCamera()
                  },
                  { 
                    text: "Gallery", 
                    onPress: () => onOpenGallery() 
                  }
                ]
              );
        }
    }    
    
    const onOpenCamera = async() =>{
        ImagePicker.openCamera({
            compressImageMaxWidth: 250,
            compressImageMaxHeight: 250,
            compressImageQuality:0.4,
            cropping: true,
            includeBase64:true
          }).then(image => {
            console.log(image);
            let profileData = profileDetails;
            profileData.ePhoto = image.data;
            setProfileDetails({...profileData})
          }).catch(e=>{
              console.log(e)
          });   
    }

    const onOpenGallery = async() =>{
        ImagePicker.openPicker({
            compressImageMaxWidth: 250,
            compressImageMaxHeight: 250,
            compressImageQuality:0.4,
            cropping: true,
            includeBase64:true
          }).then(image => {
            console.log(image);
            let profileData = profileDetails;
            profileData.ePhoto = image.data;
            setProfileDetails({...profileData})
          });   
    }

    const onLinkModalCancelClicked = () => {
        setShowFamilyLinkModal(false)
    }

    return(
            <AppContainer style={styles.ProfileDetailsContainer}>
                <ScrollView style={{height:'100%'}}>
                    <AppCard style={styles.ColorCodeContainer}>
                        <View style={{width:'100%',marginBottom:25}}>
                            <Image source={require('../assets/images/profileBack.png')} style={styles.BackgroundImage}/>
                            <View style={styles.PhotoAndNameContainer}>
                                <View style={styles.PhotoContainer}>
                                        <Image source={profileDetails?.ePhoto && profileDetails?.ePhoto !== 'null' ? { uri : 'data:image/png;base64,'+ profileDetails.ePhoto }:require('../assets/images/empty.png')} style={styles.Photo}/>
                                </View>
                                <TouchableOpacity onPress={()=> onPictureEditClick()}>
                                    <View style={{width:35,height:35,borderRadius:100,zIndex:10,backgroundColor: profileDetails?.ePhoto ? "#e60023":'#1ca1e4',elevation:3,marginTop:-20}}>
                                    <Icon
                                        name={profileDetails?.ePhoto ? "ios-close" : "pencil"}
                                        style={{ position: 'absolute', right: 7, top: 8,color:'white' }}
                                        size={18}
                                        color="black"
                                    /> 
                                    </View>
                                </TouchableOpacity>
                               
                                <AppTextBold style={styles.TextBoldName}>{`${profileDetails?.F_NAME && profileDetails?.F_NAME !== 'null' ? profileDetails?.F_NAME: ''} ${profileDetails?.M_NAME && profileDetails?.M_NAME !== 'null' ? profileDetails?.M_NAME : '' } ${profileDetails?.SURNAME && profileDetails?.SURNAME !== 'null' ? profileDetails?.SURNAME : ''}`}</AppTextBold>
                            </View>

                            <View style={styles.UserInfoContainer}>
                                <View style={styles.UserInfoLeftView}>
                                    <AppText style={styles.UserInfoAppText}>{profileDetails?.ENG_HOUSE_NO}</AppText>
                                    <AppText style={styles.UserInfoAppText}>{profileDetails?.IDCARD_NO}</AppText>
                                </View>
                                <View style={styles.UserInfoRightView}>
                                    <AppText style={styles.UserInfoTags}>Ac No.:- {profileDetails?.AC_NO}</AppText>
                                    <AppText style={styles.UserInfoTags}>Booth No.:- {profileDetails?.BOOTH_NO}</AppText>
                                    <AppText style={styles.UserInfoTags}>SL No.:- {profileDetails?.SL_NO}</AppText>
                                    <AppText style={{...styles.UserInfoTags,...{backgroundColor:'#ed4356'}}}>{profileDetails?.SEX === "M" ? 'MALE' : 'FEMALE'}</AppText>
                                </View>
                            </View>
                        </View>

                        <View style={{width:'100%',flexDirection:'row',justifyContent:'flex-end',marginTop:-15}}>
                            <AppButton 
                                iconColor='white' 
                                iconSize={24} 
                                icon='ios-logo-whatsapp'
                                textStyle={{fontSize:16,marginLeft:-15}}
                                onPressButton={()=>setShowSharePreview(true)}
                                buttonStyle={{backgroundColor:'#16d39a',width:50,height:40}} />

                            <AppButton 
                                iconColor='white' 
                                iconSize={24} 
                                icon='ios-call'
                                textStyle={{fontSize:16,marginLeft:-15}}
                                onPressButton={()=>Linking.openURL(`tel:${profileDetails?.CONTACTNO ? profileDetails?.CONTACTNO : null}`)}
                                buttonStyle={{backgroundColor:'#1890ff',width:50,height:40,marginLeft:10}} />
                        </View>
                
                        <View style={{width:'100%',justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
                            <AppButton 
                                iconColor='white' 
                                iconSize={24} 
                                text="Link Family" 
                                textStyle={{fontSize:16}}
                                onPressButton={()=>setShowFamilyLinkModal(true)}
                                buttonStyle={{marginTop:10,backgroundColor:'#16d39a',width:125,height:35}}  />
                        </View>

                        
                        <View style={{width:'100%',justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
                            <AppButton 
                                iconColor='white' 
                                iconSize={20} 
                                text={`Mark as ${isVoted ? "Not Voted":"Voted"}`} 
                                textStyle={{fontSize:14}}
                                onPressButton={()=>onSetVotedOrNonVoted()}
                                buttonStyle={{marginTop:10,backgroundColor:'#16d39a',width:150,height:35}}  />
                        </View>

                        <View style={styles.UserInfoCollapsibleCards}>
                            <AppCollapsibleCards style={{elevation:0}} headingText='Personal Details'>
                                <View style={styles.UserInfoWithInputContainersWithoutFlex}>
                                    <View style={{width:'100%'}}>
                                        <AppText>Mobile No.</AppText>
                                        <AppInput 
                                            hasIcon={false}
                                            style={styles.InputText}
                                            placeholderText="Enter Your Mobile No."
                                            isNumeric={true}
                                            textStyle={{flex:1,color:'black'}}
                                            onTextChange={(e)=>changeProfileDetailsValue('CONTACTNO',e)}
                                            value={profileDetails?.CONTACTNO && profileDetails?.CONTACTNO !== 'null' ? profileDetails?.CONTACTNO : ''}/>
                                    </View>
                                    <View style={{width:'100%'}}>
                                        <AppText>Other Mobile No.</AppText>
                                        <AppInput 
                                            hasIcon={false}
                                            style={styles.InputText}
                                            placeholderText="Enter Your Secondary Mobile No."
                                            isNumeric={true}
                                            textStyle={{flex:1,color:'black'}}
                                            onTextChange={(e)=>changeProfileDetailsValue('CONTACTNO2',e)}
                                            value={profileDetails?.CONTACTNO2 && profileDetails?.CONTACTNO2 !== 'null' ? profileDetails?.CONTACTNO2 : ''}/>
                                    </View>
                                </View>

                                <View style={styles.UserInfoWithInputContainers}>
                                    <View style={{width:'45%'}}>
                                        <AppText>Date of Birth</AppText>
                                        <AppInput 
                                            hasIcon={false}
                                            value={profileDetails?.BIRTHDATE ? profileDetails?.BIRTHDATE?.split('T')[0].split('-')[2]+'-'+profileDetails?.BIRTHDATE?.split('T')[0].split('-')[1]+'-'+profileDetails?.BIRTHDATE?.split('T')[0].split('-')[0]:''}
                                            style={styles.InputText}
                                            textStyle={{flex:1,color:'black'}}
                                            placeholderText="Enter Your Secondary Mobile No."
                                            onTextChange={()=>{}}
                                            onSelect={()=> setShowDOBPicker(true)}/>
                                            
                                            {showDOBPicker ? 
                                                <DateTimePicker 
                                                    value={profileDetails?.BIRTHDATE ? new Date(parseInt(profileDetails.BIRTHDATE.split('-')[2]),parseInt(profileDetails.BIRTHDATE.split('-')[1]),parseInt(profileDetails.BIRTHDATE.split('-')[0])):new Date()} 
                                                    mode={'date'}
                                                    minimumDate={new Date(1900, 1, 1)}
                                                    maximumDate={new Date()}
                                                    is24Hour={true} 
                                                    display="default"
                                                    onChange={(event,date)=>onDateChange('BIRTHDATE',event,date)} /> 
                                                    : 
                                                    null
                                            }
                                        
                                    </View>
                                    <View style={{width:'45%'}}>
                                        <AppText>Date of Marriage.</AppText>
                                        <AppInput 
                                            hasIcon={false}
                                            style={styles.InputText}
                                            placeholderText="Date Of Your Marriage"
                                            onTextChange={()=>{}}
                                            textStyle={{flex:1,color:'black'}}
                                            value={profileDetails?.DOM ? profileDetails?.DOM.split('T')[0].split('-')[2]+'-'+profileDetails?.DOM?.split('T')[0].split('-')[1]+'-'+profileDetails?.DOM?.split('T')[0].split('-')[0] : ''}
                                            onSelect={()=> setShowMarriagePicker(true)}
                                            />

                                        {showMarriagePicker ? 
                                                <DateTimePicker 
                                                    value={profileDetails?.DOM ? new Date(parseInt(profileDetails.DOM.split('-')[0]),parseInt(profileDetails.DOM.split('-')[1]),parseInt(profileDetails.DOM.split('-')[2])):new Date()} 
                                                    mode={'date'} 
                                                    is24Hour={true} 
                                                    display="default"
                                                    onChange={(event,date)=>onDateChange('DOM',event,date)} /> 
                                                    : 
                                                    null
                                            }
                                    </View>
                                </View>

                                <View style={styles.UserInfoWithInputContainers}>
                                    <View style={{width:'45%'}}>
                                        <AppText>Blood Group</AppText>
                                        <AppPicker data={bloodGroup} 
                                                   value={profileDetails?.BLOOD_GROUP} 
                                                   onSelectData={(e)=> changeProfileDetailsValue('BLOOD_GROUP',e)}/>
                                    </View>
                                    <View style={{width:'45%'}}>
                                        <AppText>PP/PC</AppText>
                                        <AppPicker data={PPCC} 
                                                   value={profileDetails?.PGPC ? PPCC[profileDetails?.PGPC]?.title : PPCC[0]?.title}
                                                   onSelectData={(e)=> changeProfileDetailsValue('PGPC',e)}/>
                                    </View>
                                </View>

                                <View style={styles.UserInfoWithInputContainersWithoutFlex}>
                                        <AppText>House No.</AppText>
                                        <AppInput 
                                            hasIcon={false}
                                            style={styles.InputText}
                                            placeholderText="Enter Your House No."
                                            onTextChange={(e)=>changeProfileDetailsValue('ENG_HOUSE_NO',e)}
                                            value={profileDetails?.ENG_HOUSE_NO}/>
                                </View>

                                <View style={styles.UserInfoWithInputContainersWithoutFlex}>
                                    <AppText>Sex</AppText>
                                    
                                    <View style={{width:'100%',flexDirection:'row'}}>
                                        <TouchableOpacity onPress={()=> changeProfileDetailsValue('SEX','M')}>
                                            <View style={{...styles.CustomCheckBox,...{borderColor:profileDetails?.SEX === 'M' ? '#f49d34':'#e5edf1'}}}>
                                                <AppText style={{color:profileDetails?.SEX === 'M' ? '#f49d34':'black'}}>Male</AppText>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={()=> changeProfileDetailsValue('SEX','F')}>
                                            <View style={{...styles.CustomCheckBox,...{borderColor:profileDetails?.SEX === 'F' ? '#f49d34':'#e5edf1'}}}>
                                                <AppText style={{color:profileDetails?.SEX === 'F' ? '#f49d34':'black'}}>Female</AppText>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    
                                </View>

                                <View style={styles.UserInfoWithInputContainersWithoutFlex}>
                                    <AppText>Vaccination Done ?</AppText>
                                    
                                    <View style={{width:'100%',flexDirection:'row'}}>
                                        <TouchableOpacity onPress={()=> changeProfileDetailsValue('VACCINATION',true)}>
                                            <View style={{...styles.CustomCheckBox,...{borderColor:profileDetails?.VACCINATION ? '#f49d34':'#e5edf1'}}}>
                                                <AppText style={{color:profileDetails?.VACCINATION  ? '#f49d34':'black'}}>Yes</AppText>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={()=> changeProfileDetailsValue('VACCINATION',false)}>
                                            <View style={{...styles.CustomCheckBox,...{borderColor:profileDetails?.VACCINATION ? '#e5edf1':'#f49d34'}}}>
                                                <AppText style={{color:profileDetails?.VACCINATION  ? 'black':'#f49d34'}}>No</AppText>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                
                                </View>
                            </AppCollapsibleCards>


                            <AppCollapsibleCards style={{elevation:0}} headingText='Other Details'>
                                <View style={styles.UserInfoWithInputContainers}>
                                    <View style={{width:'45%'}}>
                                        <AppText>Ration Cards</AppText>
                                        <AppPicker data={rationCard}
                                                   value={profileDetails?.RATION_CARD === 0 ? "APL-1":profileDetails?.RATION_CARD === 1? "APL-2" :"BPL"}
                                                   onSelectData={(e)=> changeProfileDetailsValue('RATION_CARD',e)}/>
                                    </View>
                                    <View style={{width:'45%'}}>
                                        <AppText>Ecasts</AppText>
                                        {/* <AppPicker data={eCast} 
                                        value={profileDetails?.eCAST}
                                        onSelectData={(e)=> changeProfileDetailsValue('eCAST',e)}/> */}
                                         <AppInput 
                                            hasIcon={false}
                                            style={styles.InputText}
                                            placeholderText="Select Ecast"
                                            onSelect={()=>setShowSearchablePicker(true)}
                                            value={profileDetails?.eCAST}/>
                                    </View>
                                </View>

                                <View style={styles.UserInfoWithInputContainersWithoutFlex}>
                                    <AppText>Death</AppText>
                                    
                                    <View style={{width:'100%',flexDirection:'row'}}>
                                        <TouchableOpacity onPress={()=> changeProfileDetailsValue('isDEATH',true)}>
                                            <View style={{...styles.CustomCheckBox,...{borderColor:profileDetails?.isDEATH ? '#f49d34':'#e5edf1'}}}>
                                                <AppText style={{color:profileDetails?.isDEATH ? '#f49d34':'black'}}>Yes</AppText>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={()=> changeProfileDetailsValue('isDEATH',false)}>
                                            <View style={{...styles.CustomCheckBox,...{borderColor:!profileDetails?.isDEATH ? '#f49d34':'#e5edf1'}}}>
                                                <AppText style={{color:!profileDetails?.isDEATH ? '#f49d34':'black'}}>No</AppText>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.UserInfoWithInputContainersWithoutFlex}>
                                    <AppText>Anaj</AppText>
                                    
                                    <View style={{width:'100%',flexDirection:'row'}}>
                                        <TouchableOpacity onPress={()=> changeProfileDetailsValue('AANAJ',1)}>
                                            <View style={{...styles.CustomCheckBox,...{borderColor:parseInt(profileDetails?.AANAJ) === 1 ? '#f49d34':'#e5edf1'}}}>
                                                <AppText style={{color:parseInt(profileDetails?.AANAJ) === 1 ? '#f49d34':'black'}}>Yes</AppText>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={()=> changeProfileDetailsValue('AANAJ',0)}>
                                            <View style={{...styles.CustomCheckBox,...{borderColor:parseInt(profileDetails?.AANAJ) === 0 ? '#f49d34':'#e5edf1'}}}>
                                                <AppText style={{color:parseInt(profileDetails?.AANAJ) === 0 ? '#f49d34':'black'}}>No</AppText>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.UserInfoWithInputContainersWithoutFlex}>
                                    <AppText>Maa Card (PMJAY)</AppText>
                                    
                                    <View style={{width:'100%',flexDirection:'row'}}>
                                        <TouchableOpacity onPress={()=> changeProfileDetailsValue('MA_CARD',1)}>
                                            <View style={{...styles.CustomCheckBox,...{borderColor:parseInt(profileDetails?.MA_CARD) === 1 ? '#f49d34':'#e5edf1'}}}>
                                                <AppText style={{color:parseInt(profileDetails?.MA_CARD) === 1 ? '#f49d34':'black'}}>Yes</AppText>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={()=> changeProfileDetailsValue('MA_CARD',0)}>
                                            <View style={{...styles.CustomCheckBox,...{borderColor:parseInt(profileDetails?.MA_CARD) === 0 ? '#f49d34':'#e5edf1'}}}>
                                                <AppText style={{color:parseInt(profileDetails?.MA_CARD) === 0 ? '#f49d34':'black'}}>No</AppText>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                
                                </View>

                                <View style={styles.UserInfoWithInputContainersWithoutFlex}>
                                    <AppText>Is Transfer ?</AppText>
                                    
                                    <View style={{width:'100%',flexDirection:'row'}}>
                                        <TouchableOpacity onPress={()=> changeProfileDetailsValue('isTransfer',1)}>
                                            <View style={{...styles.CustomCheckBox,...{borderColor:parseInt(profileDetails?.isTransfer) === 1 ? '#f49d34':'#e5edf1'}}}>
                                                <AppText style={{color:parseInt(profileDetails?.isTransfer) === 1 ? '#f49d34':'black'}}>Yes</AppText>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={()=> changeProfileDetailsValue('isTransfer',0)}>
                                            <View style={{...styles.CustomCheckBox,...{borderColor:parseInt(profileDetails?.isTransfer) === 0 ? '#f49d34':'#e5edf1'}}}>
                                                <AppText style={{color:parseInt(profileDetails?.isTransfer) === 0 ? '#f49d34':'black'}}>No</AppText>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                
                                </View>

                                <View style={styles.UserInfoWithInputContainersWithoutFlex}>
                                        <AppText>Voter's Mood</AppText>
                                        <AppPicker data={votersMood} 
                                                   value={profileDetails?.COLORCODE === "1" ? 'Positive': profileDetails?.COLORCODE === "2" ? 'Neutral': profileDetails?.COLORCODE === "3" ? 'Opposition':""} 
                                                   onSelectData={(e)=> changeProfileDetailsValue('COLORCODE',e)}
                                        />
                                </View>
                            </AppCollapsibleCards>
                        </View>

                        <AppButton 
                            iconColor='white' 
                            iconSize={24} 
                            text="Save Details" 
                            textStyle={{fontSize:18}}
                            onPressButton={()=>onSaveDetails()}
                            showActivityIndicator = {isLoading}
                            buttonStyle={{marginTop:10,backgroundColor:'#f49d34',width:'100%'}}  />

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showFamilyLinkModal}
                            onRequestClose={() => {
                                setShowFamilyLinkModal(false);
                            }}
                        >
                            <LinkMemberModule onSaveLinkedFamilyDetails={onSaveDetails} onLinkModalCancelClicked={onLinkModalCancelClicked} boothNo={profileDetails?.BOOTH_NO} acNo={profileDetails?.AC_NO} idCardNo={profileDetails?.IDCARD_NO} familyId={`${profileDetails?.AC_NO}_${profileDetails?.BOOTH_NO}_${profileDetails?.SL_NO}`}/>
                        </Modal>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showSearchablePicker}
                            onRequestClose={() => {
                                setShowFamilyLinkModal(false);
                            }}
                        >
                            <SearchablePicker onSetPickerValue={onSelectEcast}/>
                        </Modal>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showSharePreview}
                            onRequestClose={() => {
                                setShowSharePreview(false);
                            }}
                        >
                            <ShareImagePreview voterDetails={profileDetails} onCancelClicked={()=>setShowSharePreview(false)}/>
                        </Modal>
                    </AppCard>
                </ScrollView>
            </AppContainer>
    )
}

const styles = StyleSheet.create({
    ProfileDetailsContainer:{
        backgroundColor:'#F2F2F2',
        padding:5
    },
    ColorCodeContainer:{
        width:'100%',
        height:'100%',
        backgroundColor:'white',
        borderRadius:5,
        marginVertical:5,
        justifyContent:'flex-start' 
    },
    BackgroundImage:{
        height:200,
        width:'100%',
        resizeMode:'stretch'
    },
    PhotoAndNameContainer:{
        width:'45%',
        alignItems:'center'
    },
    PhotoContainer:{
        elevation:1,
        backgroundColor:'white',
        width:125,
        height:125,
        borderRadius:100,
        padding:5,
        justifyContent:'center',
        alignItems:'center',
        elevation:2,
        marginTop:-80
    },
    Photo:{
        width:120,
        height:120,
        borderRadius:100
    },
    TextBoldName:{
        fontSize:16,
        marginTop:10
    },
    UserInfoContainer:{
        width:'100%',
        justifyContent:'space-between',
        paddingHorizontal:10,
        flexDirection:'row'
    },
    UserInfoLeftView:{
        width:'50%'
    },
    UserInfoRightView:{
        width:'50%',
        justifyContent:'flex-end',
        alignItems:'flex-end',
        marginTop:-75
    },
    UserInfoAppText:{
        color:'#9ea1a4',
        marginVertical:5,
        fontSize:12
    },
    UserInfoTags:{
        backgroundColor:'#1890ff',
        color:'white',
        padding:3,
        borderRadius:5,
        marginBottom:5
    },
    InputText:{
        marginVertical:10,
        height:45
    },
    UserInfoCollapsibleCards:{
        width:'100%',
        padding:5
    },
    UserInfoWithInputContainers:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:5
    },
    UserInfoWithInputContainersWithoutFlex:{
        width:'100%',
        marginVertical:5
    },
    CustomCheckBox:{
        height:35,
        width:100,
        margin:5,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#e5edf1',
        justifyContent:'center',
        alignItems:'center'
    },
    cameraButton:{width:35,
        height:35,
        borderRadius:100,
        zIndex:10,
        backgroundColor:'#1ca1e4',
        elevation:3,
        marginTop:-20
    }
})

export default VoterProfileScreen;
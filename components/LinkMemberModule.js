import React,{useState,useEffect} from "react";
import {StyleSheet,View,ToastAndroid,FlatList,Modal,TouchableOpacity,ScrollView} from 'react-native' 
import AppButton from "./AppButton";
import AppContainer from './AppContainer'
import AppInput from './AppInput'
import AppText from "./AppText";
import AppCard from "./AppCard";
import AppTextBold from './AppTextBold'
import AsyncStorage from "@react-native-community/async-storage";
import AppSwitch from "../components/AppSwitch";
import { linkFamilyTemplate } from "../utils/utils";
import { fetchAllDataFromTable, filterDatabaseData } from "../Services";
import { useFocusEffect } from '@react-navigation/native';

let linkTemplate = [{
    slNo:null,
    name:null,
    mobile:null,
    vaccination:null
  }]
  


const LinkMemberModule = (props) =>{
    
    const [members,setMembers] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        let filteredData = filterDatabaseData(`FAMILY_ID == "${props.familyId}"`)
        
        console.log(20,props.familyId)
        if(filteredData.length > 0){
            let alreadyLinkedVoters = [];
            filteredData.forEach((voter)=>{
                if(voter.IDCARD_NO !== props.idCardNo){
                    alreadyLinkedVoters.push({
                        slNo:voter.SL_NO.toString(),
                        name:voter.ENG_F_NAME.toString(),
                        mobile:voter.CONTACTNO,
                        vaccination:voter.VACCINATION,
                        isDeath:voter.isDEATH
                      })
                }
            })
            setMembers([...alreadyLinkedVoters,...members])
        }
    
    },[])
    
    const onAddRow = () =>{
        let membersArr = members;
        
        membersArr.push({
            slNo:null,
            name:null,
            mobile:null,
            vaccination:null,
            isDeath:null
          });
        setMembers([...membersArr])
    }



    const onRemoveRow = async()=>{
        let linkedMembersList = [...members];

        let unSyncedVoters = JSON.parse(await AsyncStorage.getItem('UnSyncedVoter'))
        if(unSyncedVoters){
           let indexOfExistingLinkedMemberInUnSyncedVoter = unSyncedVoters.findIndex((unSyncedVoter) => unSyncedVoter.SL_NO.toString() === linkedMembersList[linkedMembersList.length - 1].slNo.toString())
            console.log(31,indexOfExistingLinkedMemberInUnSyncedVoter)
            if(indexOfExistingLinkedMemberInUnSyncedVoter >= 0){
                console.log('Splice')
                unSyncedVoters.splice(indexOfExistingLinkedMemberInUnSyncedVoter,1)
            }
        }

        await AsyncStorage.setItem('UnSyncedVoter',JSON.stringify(unSyncedVoters));
        
        linkedMembersList.pop();
        setMembers([...linkedMembersList])
    }

    const onSlNoChange = async(e,index) =>{
        console.log(index)
        let membersArr = [...members];
        membersArr[index].slNo = e;
        setMembers([...membersArr])
    }

    const onMobileChange = async(e,index) =>{
        let membersArr = [...members];
        membersArr[index].mobile = e;
        setMembers([...membersArr])
    }

    const onSLNoFocusOff = async(index) =>{
        let votersMembersToBeLinkedArr = members;
        let votersList = await fetchAllDataFromTable('VoterList');
 
        let voterFromVoterList = votersList.find((voter) => voter.SL_NO.toString() === votersMembersToBeLinkedArr[index].slNo.toString() 
                                && voter.BOOTH_NO.toString() === props.boothNo.toString() && voter.AC_NO.toString() === props.acNo.toString())
        if(voterFromVoterList){
            votersMembersToBeLinkedArr[index].mobile = voterFromVoterList.CONTACTNO;
            votersMembersToBeLinkedArr[index].vaccination = voterFromVoterList.VACCINATION;
            votersMembersToBeLinkedArr[index].name = voterFromVoterList.ENG_F_NAME   
        }
        else{
            votersMembersToBeLinkedArr[index].mobile = null;
            votersMembersToBeLinkedArr[index].vaccination = 0;
            votersMembersToBeLinkedArr[index].name = null
        }
        
        console.log(46,votersMembersToBeLinkedArr);
        setMembers([...votersMembersToBeLinkedArr])
    }

    const onMembersLinked = async() =>{
        setIsLoading(true)
        // await AsyncStorage.removeItem('UnSyncedVoter')

        //Get the Records First

        // let filteredData = filterDatabaseData(`FAMILY_ID == "${props.familyId}"`)



        let unSyncedVoters = JSON.parse(await AsyncStorage.getItem('unSyncedVoters'))
        
        
        let votersListFromAPI = await fetchAllDataFromTable('VoterList');
    
        let linkedVotersToBeAddedInUnSyncedStorage = []

        let votersMembersToBeLinked = [...members];
            votersMembersToBeLinked.forEach((memberToBeLinked)=>{
                /****************Check if the member To Be Linked is found in the Downloaded Voter List from /Voterlist API */
                let searchedVoterFromAPIResults = votersListFromAPI.find((voterFromAPI)=> voterFromAPI.SL_NO.toString() === memberToBeLinked.slNo.toString() && voterFromAPI.IDCARD_NO !== props.idCardNo)
                    console.log(91,searchedVoterFromAPIResults)
                
                if(searchedVoterFromAPIResults){
                    let voterObjectToBeLinked = {
                        AANAJ: searchedVoterFromAPIResults.AANAJ === 'null' || searchedVoterFromAPIResults.AANAJ === null ? 0 :searchedVoterFromAPIResults.AANAJ,
                        AC_NO: searchedVoterFromAPIResults.AC_NO,
                        AGE: searchedVoterFromAPIResults.AGE,
                        APP_UPD_DT: searchedVoterFromAPIResults.APP_UPD_DT,
                        BIRTHDATE: searchedVoterFromAPIResults.BIRTHDATE === 'null' || searchedVoterFromAPIResults.BIRTHDATE === null ? '' : searchedVoterFromAPIResults.BIRTHDATE,
                        BLOOD_GROUP: searchedVoterFromAPIResults.BLOOD_GROUP === 'null' || searchedVoterFromAPIResults.BLOOD_GROUP === null ? '':searchedVoterFromAPIResults.BLOOD_GROUP,
                        BOOTH_NO: searchedVoterFromAPIResults.BOOTH_NO,
                        CHNGLISTNO: searchedVoterFromAPIResults.CHNGLISTNO,
                        COLORCODE: searchedVoterFromAPIResults.COLORCODE === 'null' || searchedVoterFromAPIResults.COLORCODE === null ? '' : searchedVoterFromAPIResults.COLORCODE,
                        CONTACTNO: memberToBeLinked.mobile === 'null' || memberToBeLinked.mobile === null ? '' :memberToBeLinked.mobile,
                        CONTACTNO2: searchedVoterFromAPIResults.CONTACTNO2 === 'null' || searchedVoterFromAPIResults.CONTACTNO2 === null ? '' : searchedVoterFromAPIResults.CONTACTNO2,
                        DIST_NO: searchedVoterFromAPIResults.DIST_NO,
                        DOM: searchedVoterFromAPIResults.DOM === 'null' || searchedVoterFromAPIResults.DOM === null ? '' : searchedVoterFromAPIResults.DOM,
                        EMS_UPD_DT: searchedVoterFromAPIResults.EMS_UPD_DT,
                        ENG_F_NAME: searchedVoterFromAPIResults.ENG_F_NAME,
                        ENG_HOUSE_NO: searchedVoterFromAPIResults.ENG_HOUSE_NO,
                        ENG_M_NAME: searchedVoterFromAPIResults.ENG_M_NAME,
                        ENG_RLN_SURNAME: searchedVoterFromAPIResults.ENG_RLN_SURNAME,
                        ENG_SURNAME: searchedVoterFromAPIResults.ENG_SURNAME,
                        FAMILY_ID: props.familyId,
                        F_NAME: searchedVoterFromAPIResults.F_NAME,
                        HM: searchedVoterFromAPIResults.HM,
                        HOF: searchedVoterFromAPIResults.HOF,
                        HOUSE_NO: searchedVoterFromAPIResults.HOUSE_NO,
                        IDCARD_NO:searchedVoterFromAPIResults.IDCARD_NO,
                        LAST_UPD_DT: searchedVoterFromAPIResults.LAST_UPD_DT,
                        LAST_UPD_ID: searchedVoterFromAPIResults.LAST_UPD_ID,
                        MA_CARD: searchedVoterFromAPIResults.MA_CARD === 'null' || searchedVoterFromAPIResults.MA_CARD === null ? 0 :searchedVoterFromAPIResults.MA_CARD,
                        M_NAME: searchedVoterFromAPIResults.M_NAME,
                        ORGNLISTNO: searchedVoterFromAPIResults.ORGNLISTNO,
                        PAGE_NO: searchedVoterFromAPIResults.PAGE_NO,
                        PGPC: searchedVoterFromAPIResults.PGPC,
                        PMJAY: searchedVoterFromAPIResults.PMJAY,
                        PS_NO: searchedVoterFromAPIResults.PS_NO,
                        RATION_CARD: searchedVoterFromAPIResults.RATION_CARD === 'null' || searchedVoterFromAPIResults.RATION_CARD === null ? 0: parseInt(searchedVoterFromAPIResults.RATION_CARD),
                        RLN_ENG_F_NAME: searchedVoterFromAPIResults.RLN_ENG_F_NAME,
                        RLN_ENG_M_NAME: searchedVoterFromAPIResults.RLN_ENG_M_NAME,
                        RLN_F_NAME: searchedVoterFromAPIResults.RLN_F_NAME,
                        RLN_M_NAME: searchedVoterFromAPIResults.RLN_M_NAME,
                        RLN_SURNAME: searchedVoterFromAPIResults.RLN_SURNAME,
                        RLN_TYPE: searchedVoterFromAPIResults.RLN_TYPE,
                        SEX: searchedVoterFromAPIResults.SEX === 'null' || searchedVoterFromAPIResults.SEX === null ? '' :searchedVoterFromAPIResults.SEX ,
                        SL_NO: searchedVoterFromAPIResults.SL_NO,
                        STATUSTYPE: searchedVoterFromAPIResults.STATUSTYPE,
                        ST_CODE: searchedVoterFromAPIResults.ST_CODE,
                        SURNAME: searchedVoterFromAPIResults.SURNAME,
                        VACCINATION: memberToBeLinked.vaccination,
                        VIBHAG_NO: searchedVoterFromAPIResults.VIBHAG_NO,
                        VOTED: searchedVoterFromAPIResults.VOTED,
                        eCAST: searchedVoterFromAPIResults.eCAST === 'null' || searchedVoterFromAPIResults.eCAST === null ? '' :searchedVoterFromAPIResults.eCAST,
                        ePhoto: searchedVoterFromAPIResults.ePhoto === 'null' || searchedVoterFromAPIResults.ePhoto === null ? '':searchedVoterFromAPIResults.ePhoto,
                        isTransfer: searchedVoterFromAPIResults.isTransfer === 'null' || searchedVoterFromAPIResults.isTransfer === '' ? 0:searchedVoterFromAPIResults.isTransfer,
                        isUpdateAdminUser: searchedVoterFromAPIResults.isUpdateAdminUser,
                        isUpdateApp: searchedVoterFromAPIResults.isUpdateApp
                    }
                    linkedVotersToBeAddedInUnSyncedStorage.push(voterObjectToBeLinked);
                }
            })
            console.log('linkedVotersToBeAddedInUnSyncedStorage',linkedVotersToBeAddedInUnSyncedStorage)

            linkedVotersToBeAddedInUnSyncedStorage.forEach((linkedVoter,index)=>{
                console.log(index,unSyncedVoters);
                if(unSyncedVoters){
                    /***************************Check if the Voter Linked is already presnt in unsycnedVoter's Async Storage Or Not */
                    let indexOfVoterMemberLinkedFromUnSyncStorage = unSyncedVoters.findIndex((unsyncedVoter) => unsyncedVoter.SL_NO?.toString() === linkedVoter.SL_NO?.toString())
                    if(indexOfVoterMemberLinkedFromUnSyncStorage >= 0){
                        unSyncedVoters[indexOfVoterMemberLinkedFromUnSyncStorage].VACCINATION = linkedVoter.VACCINATION;
                        unSyncedVoters[indexOfVoterMemberLinkedFromUnSyncStorage].FAMILY_ID = props.familyId;
                    }
                    else{
                        unSyncedVoters.push(linkedVoter);
                    }
                }
                else{
                    unSyncedVoters = [linkedVoter]
                }
            })
          
            await AsyncStorage.setItem('unSyncedVoters',JSON.stringify(unSyncedVoters))
            console.log(116,await AsyncStorage.getItem('unSyncedVoters'))
            props.onSaveLinkedFamilyDetails();
            setIsLoading(false)
            ToastAndroid.showWithGravityAndOffset("Linking Successfully Done",ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
    }

    const onVaccinationChange = (e,index) =>{
        let membersArr = [...members];
       
        membersArr[index].vaccination = e ;
        setMembers([...membersArr])
    }

    const onDeathChange = (e,index)=>{
        let membersArr = [...members];
        membersArr[index].isDEATH = e ;
        setMembers([...membersArr])
    }

    return(
        <View style={{width:'100%',flex:1,padding:10}}>
          <ScrollView>
          <View style = {{width:'100%',padding:15,elevation:5,backgroundColor:'white',marginTop:175,marginRight:10,borderRadius:10}}>
            <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                 <AppTextBold style={{fontSize:16}}>Link Family Member</AppTextBold>
             </View>

             <View style={{width:'100%',flexDirection:'row',justifyContent:'flex-end',marginBottom:10}}>
                <AppButton 
                    iconColor='white' 
                    iconSize={24} 
                    text="-" 
                    textStyle={{fontSize:18}}
                    onPressButton={()=>onRemoveRow()}
                    buttonStyle={{marginTop:15,backgroundColor:'#ff6961',width:35,height:35,marginRight:10}}/>
                
                <AppButton 
                    iconColor='white' 
                    iconSize={24} 
                    text="+" 
                    textStyle={{fontSize:18}}
                    onPressButton={()=>onAddRow()}
                    buttonStyle={{marginTop:15,backgroundColor:'#16d39a',width:35,height:35}}  />
             </View>


            {members?.map((member,index)=>{
                return(
                    <View id={index} style={{width:'100%'}}>
                        <View  style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={{width:'48%'}}>
                                <AppInput 
                                    hasIcon={false}
                                    style={null}
                                    placeholderText="SL NO"
                                    isNumeric={true}
                                    editable={true}
                                    textStyle={{flex:1,color:'black'}}
                                    onTextChange={(e)=>onSlNoChange(e,index)}
                                    value={member.slNo} 
                                    onFocusEnd={()=>onSLNoFocusOff(index)}/>
                            </View>
                            <View style={{width:'48%'}}>
                                <AppInput 
                                    hasIcon={false}
                                    style={null}
                                    placeholderText="Name"
                                    isNumeric={false}
                                    editable={true}
                                    textStyle={{flex:1,color:'black'}}
                                    onTextChange={(e)=>{}}
                                    value={member.name}/>
                            </View>
                         </View>
                         <View  style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={{width:'100%'}}>
                                <AppInput 
                                    hasIcon={false}
                                    style={null}
                                    placeholderText="Mobile"
                                    isNumeric={false}
                                    editable={true}
                                    textStyle={{flex:1,color:'black'}}
                                    onTextChange={(e)=>onMobileChange(e,index)}
                                    value={member.mobile}/>
                            </View>
                         </View>
                         <View  style={{width:'100%',marginVertical:15,flexDirection:'row',justifyContent:'space-between'}}>
                             {console.log(303,member,member.vaccination)}
                            <View style={{width:'48%',justifyContent:'center'}}>
                                <AppSwitch  
                                    text="Vaccination" 
                                    toggle={(e)=>onVaccinationChange(e,index)} 
                                    trackColorSelected="#1890ff" 
                                    trackColorUnSelected="#bcc4cb" 
                                    thumbColorSelected="#ffa87d" 
                                    thumbColorUnSelected="#f4f3f4" 
                                    backColor="#3e3e3e"
                                    value={member.vaccination}/>
                            </View>
                            <View style={{width:'48%',justifyContent:'center'}}>
                                <AppSwitch  
                                    text="Is Death" 
                                    toggle={(e)=>onDeathChange(e,index)} 
                                    trackColorSelected="#1890ff" 
                                    trackColorUnSelected="#bcc4cb" 
                                    thumbColorSelected="#ffa87d" 
                                    thumbColorUnSelected="#f4f3f4" 
                                    backColor="#3e3e3e"
                                    value={member.isDeath}/>
                            </View>
                         </View>
                    </View>
                    
                )
            })}
            

            <AppButton 
                iconColor='white' 
                iconSize={24} 
                text="Link Members" 
                textStyle={{fontSize:18}}
                onPressButton={()=>onMembersLinked()}
                showActivityIndicator={isLoading}
                buttonStyle={{marginTop:15,backgroundColor:'#f49d34',width:'100%'}}  />

            {/* <AppButton 
                iconColor='white' 
                iconSize={24} 
                text="Cancel" 
                textStyle={{fontSize:18,color:'#ff6961'}}
                onPressButton={()=> props.onCancel()}
                buttonStyle={{marginTop:15,borderWidth:1,borderColor:'#ff6961',backgroundColor:'white',width:'100%'}}  /> */}

           </View>    
        </ScrollView>
    </View>
    
    )

}

export default LinkMemberModule;
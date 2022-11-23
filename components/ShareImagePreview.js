import React,{useRef,useState} from 'react'
import { View,StyleSheet,Image} from 'react-native';
import AppButton from './AppButton';
import AppContainer from './AppContainer';
import AppText from './AppText';
import AppTextBold from './AppTextBold';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import moment from 'moment';
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';
import { useFocusEffect } from '@react-navigation/native';
import { apiCall } from '../Services';


const ShareImagePreview = ({voterDetails,onCancelClicked}) =>{
    const reff = useRef();
    const [candidateDetails,setCandidateDetails] = useState(null);
    const [isLoading,setIsLoading] = useState(false);

    const onShareClicked = async()=>{
        if(voterDetails.CONTACTNO){
            reff.current.capture().then((uri)=>{
                const shareOptions = {
                    title: 'Share via',
                    message: `
candidate name : ${candidateDetails.candidateName}
party_name:${'B.J.P'}
Symbol:${'Lotus'} 

--------------Voter Details--------------

name: ${voterDetails.F_NAME} ${voterDetails.M_NAME} ${voterDetails.RLN_SURNAME}
srno: ${voterDetails.SL_NO}
vcardId: ${voterDetails.IDCARD_NO}
house no: ${voterDetails.HOUSE_NO}
booth Address: ${candidateDetails?.POLLING_LOCATION}`,
                    url: uri,
                    social: Share.Social.WHATSAPP,
                    whatsAppNumber: `91${voterDetails.CONTACTNO}`,  // country code + phone number
                    filename: 'test' , // only for base64 file in Android
                  };
                
                  Share.shareSingle(shareOptions)
                    .then((res) => { console.log(res) })
                    .catch((err) => { err && console.log(err); });
            })
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            async function getCandidatePhoto(){
                setIsLoading(true);
                const candidatePhotoResult = await apiCall("post","getCandidatePhoto",{accountNo:voterDetails.AC_NO,boothNo:voterDetails.BOOTH_NO});
                console.log(55,candidatePhotoResult);
                if(candidatePhotoResult.status === 200 && candidatePhotoResult?.data?.length > 0) {
                    setCandidateDetails({...candidatePhotoResult.data[0]});
                    setIsLoading(false);
                }
                setIsLoading(false);
            } 

           getCandidatePhoto();
        },[])
    )

    return (
        <AppContainer style={{...styles.AppContainer,...{justifyContent:'center',alignItems:'center',backgroundColor:null,padding:10}}}>
            <ViewShot ref={reff}  options={{ format: "jpg", quality: 0.9 }} style={styles.ImageContainer}> 
                {
                candidateDetails?.candidatePhoto && candidateDetails?.candidatePhoto.length > 0 ? 
                    <Image source={{uri:candidateDetails.candidatePhoto}} resizeMode='contain' style={styles.Image} />
                :null
                }
             </ViewShot>
             <View style={{backgroundColor:'white'}}>
             <View style={styles.FirstInfoContainer}>
                    <View style={styles.FirstInfo}>
                        <AppTextBold style={{color:'#f39834'}}>AC No : - <AppText>{voterDetails.AC_NO}</AppText></AppTextBold>
                    </View>
                    <View style={styles.FirstInfo}>
                        <AppTextBold style={{color:'#f39834'}}>Booth No : - <AppText>{voterDetails.BOOTH_NO}</AppText></AppTextBold>
                    </View>
                    <View style={styles.FirstInfo}>
                        <AppTextBold style={{color:'#f39834'}}>SL No : - <AppText>{voterDetails.SL_NO}</AppText></AppTextBold>
                    </View>
                </View>
                <View style={{width:'100%',flexDirection:'row'}}>
                    <View style={{width:'30%',borderWidth:1,height:200,backgroundColor:'white'}}>
                        <Image source={voterDetails?.ePhoto && voterDetails?.ePhoto !== 'null' ? { uri : 'data:image/png;base64,'+ voterDetails.ePhoto }:require('../assets/images/empty.png')} style={{width:'100%',height:200}}/>
                    </View>
                    <View style={{width:'70%'}}>
                        <View style={{width:'100%',marginVertical:5,paddingHorizontal:5}}>
                            <AppTextBold>Name : - {`${voterDetails.ENG_F_NAME} ${voterDetails.ENG_M_NAME} ${voterDetails.ENG_SURNAME}`}</AppTextBold>
                        </View>
                        <View style={{width:'100%',marginVertical:5,paddingHorizontal:5}}>
                            <AppTextBold>Designation : - {voterDetails.PGPC} </AppTextBold>
                        </View>
                        <View style={{width:'100%',marginVertical:5,paddingHorizontal:5}}>
                            <AppTextBold>Address : - {`${voterDetails.HOUSE_NO}`}</AppTextBold>
                        </View>

                        <View style={{width:'100%',flexDirection:'row',padding:10}}>
                            <View style={{width:'50%',borderWidth:1}}>
                                <AppTextBold>Mobile : - {voterDetails.CONTACTNO} </AppTextBold>
                            </View>
                            <View style={{width:'50%',borderWidth:1}}>
                                <AppTextBold>Blood Group : - {voterDetails.BLOOD_GROUP}</AppTextBold>
                            </View>
                        </View>
                        <View style={{width:'100%',flexDirection:'row',padding:10,marginTop:-20}}>
                            <View style={{width:'50%',borderWidth:1}}>
                                <AppTextBold>D.O.B :- {moment(voterDetails.BIRTHDATE).format('DD-MM-YYYY')} </AppTextBold>
                            </View>
                            <View style={{width:'50%',borderWidth:1}}>
                                <AppTextBold>D.O.M :- {moment(voterDetails.DOM).format('DD-MM-YYYY')}</AppTextBold>
                            </View>
                        </View>
                        <View style={{width:'100%',padding:10,marginTop:-20}}>
                            <View style={{width:'100%',borderWidth:1}}>
                                <AppTextBold>Id Card : - {voterDetails.IDCARD_NO}</AppTextBold>
                            </View>
                        </View>
                        <View style={{width:'100%',padding:10,marginTop:-20}}>
                            <View style={{width:'100%',borderWidth:1}}>
                                <AppTextBold>Ward : - </AppTextBold>
                            </View>
                        </View>
                    </View>
                </View>
             </View>   
                
            <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around',marginTop:10}}>
                <AppButton
                    text={'Share Image'}
                    buttonStyle={{width:'45%',backgroundColor:'#16d39a'}}
                    icon="share-social"
                    iconColor={'white'}
                    iconSize={18}
                    onPressButton={()=>onShareClicked()}
                />
                <AppButton
                    text={'Cancel'}
                    buttonStyle={{width:'45%',backgroundColor:'#ff6961'}}
                    icon="close"
                    iconColor={'white'}
                    iconSize={18}
                    onPressButton={()=>onCancelClicked()}
                />
            </View>
        </AppContainer>
    );
}

const styles = StyleSheet.create({
    ImageContainer:{
        width:'100%',
        borderRadius:5,
        elevation:3,
        backgroundColor:'white',
        justifyContent:'flex-start',
        alignItems:'flex-end',
        backgroundColor:'white'
    },
    Image:{
        width:'100%',
        borderWidth:1,
        height:250
    },
    FirstInfoContainer:{
        width:'100%',
        height:35,
        flexDirection:'row',
        borderBottomWidth:3,
        borderColor:'#f39834'
    },
    FirstInfo:{
        width:'33%',
        alignItems:'flex-start',
        justifyContent:'center'
    }
})

export default ShareImagePreview;
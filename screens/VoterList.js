import React,{useState,useEffect} from 'react'
import {View,StyleSheet,Text,FlatList, PermissionsAndroid,ToastAndroid,ActivityIndicator} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { apiCall } from '../Services';
import VoterCard from '../components/VoterCard';
import AppButton from '../components/AppButton';
var RNFS = require('react-native-fs');
import XLSX from 'xlsx'

const VoterList = ({route,navigation}) =>{
    const [voterList,setVoterList] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            async function fetchVoterList(){
                try{
                    setIsLoading(true);
                    const voters = await apiCall("post","getVoterListAccToBooths",{...route.params.apiBody});
                    if(voters.status = 200){
                        setVoterList([...voters.voterList]);
                        setIsLoading(false);
                    }
                else{
                        ToastAndroid.showWithGravityAndOffset("Something went Wrong While Fetching Voters",ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
                        console.log();
                        setIsLoading(false);
                    }
                }
                catch(e){
                    ToastAndroid.showWithGravityAndOffset(e.getMessage(),ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
                    console.log(e);
                    setIsLoading(false);
                }
                
            }
            fetchVoterList();
        }, [])
    );

    const makeid=(length)=> {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const exportDataToExcel = async() => {

        // Created Sample data
        let sample_data_to_export = [{id: '1', name: 'First User'},{ id: '2', name: 'Second User'}];
        const voterDataToBeExported = [];
        console.log(voterList[0]);
        voterList?.forEach((voter)=>{
            voterDataToBeExported.push({
                FirstName:voter.ENG_F_NAME,
                MiddleName:voter.ENG_M_NAME,
                LastName:voter.ENG_SURNAME,
                AC_NO:voter.AC_NO,
                BOOTH_NO:voter.BOOTH_NO,
                SL_NO:voter.SL_NO,
                VIBHAG_NO:voter.VIBHAG_NO,
                VIBHAG_NAME:voter.VIBHAG_NAME,
                MOBILE_NO:voter.MOBILE_NO
            })
        })
    
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(voterDataToBeExported)    
        XLSX.utils.book_append_sheet(wb,ws,"Users")
        const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});

        if (!await RNFS.exists(RNFS.DownloadDirectoryPath + `/EMS`)){
            console.log(55,RNFS.DownloadDirectoryPath + `/EMS`);
            await RNFS.mkdir(RNFS.DownloadDirectoryPath + `/EMS`);
        }
        

        RNFS.writeFile(RNFS.DownloadDirectoryPath + `/EMS/my_exported_file.${makeid(5)}.xlsx`, wbout, 'ascii').then((r)=>{
            console.log(RNFS.DownloadDirectoryPath + `/EMS/my_exported_file.${makeid(5)}.xlsx`,r);
            ToastAndroid.show("File Stored in Downloads Folder"+RNFS.DownloadDirectoryPath + `/my_exported_file.${makeid(5)}.xlsx`, ToastAndroid.LONG);
            console.log('Success');
        }).catch((e)=>{
            ToastAndroid.show(`File not Stored : ${e}`, ToastAndroid.LONG);
            console.log('Error', e);
        });
    }

    const onExportButtonClicked = async() => {
        const isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if(!isPermitedExternalStorage){
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                  title: "Storage permission needed",
                  buttonNeutral: "Ask Me Later",
                  buttonNegative: "Cancel",
                  buttonPositive: "OK"
                }
              );

              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                exportDataToExcel();
            }
        }
        else{
            exportDataToExcel();
        }   
        
    }

    const onVoterCardClick = (item) =>{
        navigation.navigate('VoterProfileScreen',{voter:JSON.stringify(item)})
    }

    return (
        <View style={styles.AppContainer}>
            <View style={{width:'100%',height:50,alignItems: 'flex-end'}}>
                <AppButton 
                    iconColor='white' 
                    iconSize={24} 
                    text="Export Data" 
                    textStyle={{fontSize:18}}
                    onPressButton={()=>onExportButtonClicked()}
                    buttonStyle={{borderRadius:5,marginBottom:15,backgroundColor:'#ff6961',width:150,height:35,marginRight:10}}/>
            </View>
         {
         isLoading ? 
            <View style={{flex: 1,width:'100%',justifyContent: 'center',alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#f49d34"/>
            </View>
            :
            voterList && voterList.length > 0 ? 
                <FlatList 
                    style={{width:'100%'}}
                    data={voterList}
                    renderItem={({ item, index, separators }) => <VoterCard item={item} index ={index} onVoterCardPress={onVoterCardClick}/>}
                    keyExtractor = {(item) => item.IDCARD_NO}/> 
                : 
                null
         }
        </View>
        
    );
}

const styles = StyleSheet.create({
    AppContainer:{
        alignItems:'flex-start',
        padding:10,
        flex:1
    },
})

export default VoterList;
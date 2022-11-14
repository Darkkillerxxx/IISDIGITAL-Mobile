import React,{useState,useEffect} from 'react'
import {View,StyleSheet,Text,FlatList, PermissionsAndroid,ToastAndroid} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { apiCall } from '../Services';
import VoterCard from '../components/VoterCard';
import AppButton from '../components/AppButton';
var RNFS = require('react-native-fs');
import XLSX from 'xlsx'

const VoterList = ({route}) =>{
    const [voterList,setVoterList] = useState([]);
    
    useFocusEffect(
        React.useCallback(() => {
            async function fetchVoterList(){
                const voters = await apiCall("post","getVoterListAccToBooths",{...route.params.apiBody});
                if(voters.status = 200){
                    setVoterList([...voters.voterList]);
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

        voterList?.forEach((voter)=>{
            voterDataToBeExported.push({
                FirstName:voter.ENG_F_NAME,
                MiddleName:voter.ENG_M_NAME,
                LastName:voter.ENG_SURNAME
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

    const onVoterCardClick = () => {}

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
        padding:10
    },
})

export default VoterList;
import AsyncStorage from '@react-native-community/async-storage';
import axios from "axios"
import {ToastAndroid} from 'react-native'
// const BASE_URL = 'http://103.116.176.242:3001/'
const BASE_URL = 'http://192.168.1.20:3001/'
// import sqlite from 'react-native-sqlite-storage';
import Realm from "realm";
let realm;

const VoterSchema = {
    name: "VoterList",
    properties: {
        ST_CODE: "string?",
        AC_NO: "int?",
        BOOTH_NO: "int?",
        SL_NO: "int?",
        PS_NO: "string?",
        DIST_NO: "int?",
        VIBHAG_NO: "int?",
        HOUSE_NO: "string?",
        ENG_HOUSE_NO: "string?",
        F_NAME: "string?",
        ENG_F_NAME: "string?",
        M_NAME: "string?",
        ENG_M_NAME: "string?",
        SURNAME: "string?",
        ENG_SURNAME: "string?",
        RLN_F_NAME: "string?",
        RLN_M_NAME: "string?",
        RLN_SURNAME: "string?",
        RLN_ENG_F_NAME: "int?",
        RLN_ENG_M_NAME: "string?",
        ENG_RLN_SURNAME: "string?",
        IDCARD_NO: "string",
        SEX: "string?",
        RLN_TYPE: "string?",
        AGE: "int?",
        STATUSTYPE: "string?",
        ORGNLISTNO: "int?",
        CHNGLISTNO: "int?",
        BIRTHDATE: "string?",
        DOM: "string?",
        CONTACTNO: "string?",
        CONTACTNO2: "string?",
        eCAST: "string?",
        PGPC: "int?",
        PAGE_NO: "int?",
        M_NAME: "string?",
        ePhoto: "string?",
        isTransfer: "int?",
        LAST_UPD_ID: "string?",
        LAST_UPD_DT: "string?",
        isUpdateApp: "bool?",
        isUpdateAdminUser: "bool?",
        COLORCODE: "string?",
        VOTED: "bool?",
        BLOOD_GROUP: "string?",
        RATION_CARD: "int?",
        AANAJ: "int?",
        MA_CARD: "int?",
        PMJAY: "int?",
        VACCINATION: "bool?",
        HOF: "int?",
        FAMILY_ID: "string?",
        APP_UPD_DT: "string?",
        EMS_UPD_DT: "string?",
        HM: "string?",
        isDEATH:"bool?"
    },
    primaryKey: "IDCARD_NO",
  };

export const checkToken = async() => {
    initiateSchema();
    let tokenStoredInAsyncStorage = await AsyncStorage.getItem('authToken');
    console.log(7,tokenStoredInAsyncStorage)
    if(tokenStoredInAsyncStorage){
        let checkTokenResponse = await apiCall('get','checkUserToken',null)
        console.log(79,checkTokenResponse)
        if(checkTokenResponse.status === 200){
            return true
        }
    }
    return false;
}

export const apiCall = async(type,endpoint,body)=>{
    console.log(BASE_URL + endpoint)
    console.log(await AsyncStorage.getItem('authToken'))
    let response = await axios({
        method: type,
        url: BASE_URL + endpoint,
        headers:{
            authtoken:await AsyncStorage.getItem('authToken'),
        },
        data: body
    })

    return response.data;
}

export const initiateSchema = async() =>{
    //BoothList Table
     realm = await Realm.open({
        path: "iisDigital",
        schema: [VoterSchema],
        deleteRealmIfMigrationNeeded:true,
      });
      console.log(109,realm)
}

export const filterDatabaseData =(filterQuery)=>{
    const voter = realm.objects("VoterList");

    const data = voter.filtered(filterQuery);

    return data;
}

export const makeDatabaseTransactions = async(schema,tasks) =>{
      realm.write(() => {
        tasks.forEach(task => {
            realm.create(schema, task, "modified");
        }); 
        
        console.log('Created Voters Record')
      })

}

export const fetchAllDataFromTable = async(table)=> {
      return realm.objects(table);
}


export const fetchAllDataFromTableWithOpenAndClose = async(table)=> {
    realm = await Realm.open({
        path: "iisDigital",
        schema: [VoterSchema],
      });
    let data = realm.objects(table);
    realm.close();
    return data;
}
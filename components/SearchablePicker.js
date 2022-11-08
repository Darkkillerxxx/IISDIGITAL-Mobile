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
import {eCast} from '../utils/utils';

const SearchablePicker = ({onSetPickerValue}) => { 
    const [cast,setCast] = useState('')
    const [castList,setCastList] = useState([...eCast])

    const onCastSearch = (value) => {
        setCast(value);
        let filteredCastList = eCast.filter((cast)=> cast.title.includes(value))
        setCastList([...filteredCastList])
    }

    return (
        <View style={styles.SearchablePickerContainer}>
            <ScrollView>
                <View style={styles.Picker}>
                    <AppInput 
                        hasIcon={false}
                        style={styles.InputText}
                        placeholderText="Search eCast"
                        onTextChange={(e)=>onCastSearch(e)}
                        value={cast}/>
                    
                    <View style={styles.CastList}>
                        {castList.map((cast)=> 
                        <TouchableOpacity onPress={()=>onCastSearch(cast.id)} style={styles.Cast}>
                            <AppText>{cast.title}</AppText>
                        </TouchableOpacity>
                        )}
                    </View>

                    <AppButton 
                        iconColor='white' 
                        iconSize={24} 
                        text="Select eCast" 
                        textStyle={{fontSize:18}}
                        onPressButton={()=>onSetPickerValue(cast)}
                        buttonStyle={{marginTop:10,backgroundColor:'#f49d34',width:'100%'}}  />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    SearchablePickerContainer:{
        width:'100%',
        flex:1,
        padding:10
    },
    Picker:{
        backgroundColor:'white',
        padding:10,
        margin:10
    },
    CastList:{
        padding:10,
        width:'100%'
    },
    Cast:{
        margin:10
    }

})

export default SearchablePicker;
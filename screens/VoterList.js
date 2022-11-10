import React,{useState,useEffect} from 'react'
import {View,StyleSheet,Text,FlatList} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { apiCall } from '../Services';
import VoterCard from '../components/VoterCard';
import AppButton from '../components/AppButton';

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

    const onVoterCardClick = () => {}

    return (
        <View style={styles.AppContainer}>
            <View style={{width:'100%',height:50,alignItems: 'flex-end'}}>
                <AppButton 
                    iconColor='white' 
                    iconSize={24} 
                    text="Export Data" 
                    textStyle={{fontSize:18}}
                    onPressButton={()=>{}}
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
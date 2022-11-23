import React,{useEffect,useState,Platform} from 'react';
import {View,StyleSheet,TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import AppText from './AppText'
import { ScrollView } from 'react-native-gesture-handler';


const AppPicker = ({data,style,onSelectData,value}) =>{
    const [selectedVal,setSelectedVal] = useState(value)
    const [isModalVisible,setIsModalVisible] = useState(false)
    
    return(
        <>
            <TouchableOpacity onPress={()=>setIsModalVisible(true)} style={{...styles.AppPicker,...style}}>
                      <AppText style={{color:selectedVal === "" ? "grey":'black'}}>
                        {selectedVal === "" ? "" : selectedVal}
                      </AppText>            

                      <Icon
                        name="caret-down-outline"
                        style={{ position: 'absolute', right: 10, top: 15 }}
                        size={24}
                        color="black"
                      /> 
            </TouchableOpacity>

            <Modal
                    isVisible={isModalVisible}
                    style={{  margin: 0, alignItems: 'center', justifyContent: 'center',padding:10 }}
                    onRequestClose={() => setIsModalVisible(false)}>
                    <ScrollView style={{width:'100%'}}>
                        <View style={{width:'100%',backgroundColor:'white',padding:10}}>
                            {data.map(result=>{
                                return(
                                <TouchableOpacity onPress={()=>{
                                                                setSelectedVal(result.title)
                                                                onSelectData(result.id)
                                                                setIsModalVisible(false)
                                                                }}>
                                    <AppText style={{color:'black',marginVertical:10}}>
                                        {result.title}
                                    </AppText>
                                </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>
                </Modal> 
        </>
    )
}

const styles = StyleSheet.create({
    AppPicker:{
        width:'100%',
        height:50,
        borderWidth:1,
        borderColor:'#e4e4e4',
        borderRadius:5,
        padding:10,
        justifyContent:'center',
        alignItems: 'flex-start',
        marginTop:10
    }
})

export default AppPicker;
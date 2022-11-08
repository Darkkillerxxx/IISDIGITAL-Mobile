import React,{useState} from 'react';
import { View,StyleSheet,Text,TouchableOpacity,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const AppButton = ({text,buttonStyle,textStyle,onPressButton,disabled,icon,iconColor,iconSize,showActivityIndicator,iconStyle}) =>{
    return (
        <TouchableOpacity disabled={disabled} style={{...styles.AppButton,...buttonStyle}} onPress={()=> onPressButton()}>
            {
            icon ?
            <Icon name={icon} style={{...{marginRight:15},...iconStyle}} size={iconSize} color={iconColor}/> 
                :
               null 
            }
            {showActivityIndicator ?
                <ActivityIndicator size="large" color="white" />
            :
                <Text style={{...styles.AppText,...textStyle}}>{text}</Text>
            } 
            
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    AppButton:{
        width:'90%',
        height:50,
        elevation:5,
        borderRadius:10,
        backgroundColor:'#1890ff',
        justifyContent:'center',
        alignItems: 'center',
        flexDirection:'row'
    },
    AppText:{
        color:'white',
        fontSize:14
    }

})

export default AppButton;
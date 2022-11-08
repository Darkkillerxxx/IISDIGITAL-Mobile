import React from 'react';
import { View,StyleSheet,Text,TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const AppInput = ({style,textStyle,onTextChange,placeholderText,editable,hasIcon,icon,isNumeric,isSecured,index,value,onSelect,onFocusEnd}) =>{

    return (
        <View style={{...styles.AppInput,...style}}>
            {
                hasIcon ? 
                <Icon name={icon} size={24} color="black" /> 
                :
                null
            }   
            <TextInput onBlur={() => onFocusEnd ? onFocusEnd() : null} editable={editable} value={value} keyboardType={isNumeric ? 'numeric':'default'} onFocus={()=> onSelect ? onSelect() : null} secureTextEntry = {isSecured} onChangeText={(e) => onTextChange(e,index)} placeholder={placeholderText} style={{...styles.TextInput,...textStyle}} />
        </View>
    )
}


const styles = StyleSheet.create({
    AppInput:{
        width:'100%',
        height:50,
        borderWidth:1,
        borderColor:'#e4e4e4',
        borderRadius:5,
        alignItems: 'center',
        marginTop:10,
        flexDirection:'row',
        justifyContent: 'space-between',
        paddingHorizontal:10
    },
    TextInput:{
        width:'100%',
        height:'100%',
        marginLeft:5,
        color:'black'
    }
})

export default AppInput;
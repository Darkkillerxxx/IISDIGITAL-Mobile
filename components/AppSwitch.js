import React,{useState,useEffect} from 'react';
import {View,StyleSheet,Switch,TouchableOpacity} from 'react-native'
import AppText from './AppText'

const AppSwitch = ({containerStyle,textStyle,trackColorSelected,trackColorUnSelected,thumbColorSelected,thumbColorUnSelected,backColor,toggle,text,value}) =>{

    const [isEnabled,setIsEnabled] = useState(value);
    
    useEffect(()=>{
        toggle(isEnabled)
    },[isEnabled])

    useEffect(()=>{
        setIsEnabled(value)
    },[value])

    const toggleSwitch = () => {
        setIsEnabled(!isEnabled)
    } 

    return(
        <View style={{...styles.SwitchContainer,...containerStyle}}>
            <AppText style={{...styles.TextStyle,...textStyle}}>{text}</AppText>
            <Switch
                trackColor={{ false: trackColorUnSelected, true: trackColorSelected }}
                thumbColor={isEnabled ? thumbColorSelected: thumbColorUnSelected}
                ios_backgroundColor={backColor}
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    SwitchContainer:{
        flexDirection:'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    TextStyle:{
        marginRight:10,

    }
})

export default AppSwitch;
import React from 'react';
import { View,StyleSheet,Text } from 'react-native';

const AppCard = ({children,style}) =>{
    return (
        <View style={{...styles.AppCard,...style}}>
            {children}
        </View>
    )
}


const styles = StyleSheet.create({
    AppCard:{
        width:'50%',
        height:150,
        elevation:5,
        borderRadius:10,
        justifyContent:'center',
        alignItems: 'center'
    }
})

export default AppCard;
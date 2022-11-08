import React from 'react';
import {StyleSheet,Text } from 'react-native';

const AppText = ({children,style}) =>{
    return (
        <Text style={{...styles.AppText,...style}}>
            {children}
        </Text>
    )
}


const styles = StyleSheet.create({
    AppText:{
       color:'black',
       fontSize:14,
       fontFamily:'Montserrat-Regular'
    }
})

export default AppText;
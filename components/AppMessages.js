import React from 'react';
import { View,StyleSheet } from 'react-native';
import  Icon  from 'react-native-vector-icons/Ionicons';
import AppText from './AppText';

const AppMessage = ({content}) => (
    <View style={{...styles.messageContainer,...{backgroundColor:content.backgroundColor}}}>
         <Icon name={content.icon} size={35} color={"white"}/> 
         <View style={styles.messages}>
            <AppText style={{color:'white',fontSize:18}}>{content.heading}</AppText>
            <AppText style={{color:'white',fontSize:14}}>{content.message}</AppText>
         </View>
    </View>
);

const styles = StyleSheet.create({
    messageContainer:{
        width:'95%',
        height:65,
        position:'absolute',
        backgroundColor:'#2ab574',
        alignSelf:'center',
        elevation:5,
        marginTop:10,
        borderRadius:5,
        flexDirection:'row',
        padding:10,
        alignItems:'center'
    },
    messages:{
        marginLeft:20
    }
});

export default AppMessage;

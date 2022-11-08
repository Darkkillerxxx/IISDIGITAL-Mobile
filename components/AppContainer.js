import React from 'react'
import {StyleSheet,View} from 'react-native'

const AppContainer =({children,style}) =>{

    return(
        <View style={{...styles.appContainer,...style}}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    appContainer:{
        flex:1,
        width:'100%',
        backgroundColor:'white'
    }
})

export default AppContainer;
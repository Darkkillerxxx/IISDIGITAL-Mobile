import React,{useState,useEffect} from 'react'
import { View,StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppText from './AppText';

const AppBottomTab = ({navContent,navigation}) => {

    const [navContents,setNavContents] = useState([])

    useEffect(()=>{
        setNavContents(...[navContent])
    },[])

    const onTabClicked = (screen) =>{
         navContent.map((res)=>{
            console.log(17,res.title,screen)
            if(res.title !== screen){
                res.isSelected = false
                return res
            }
            res.isSelected = true
            return res
        })
        navigation.navigate(screen)
    }

    return (
        <View style={styles.TabContainer}>
            {
                navContents.map((nav)=>{
                    return (                 
                        <TouchableOpacity onPress={()=> onTabClicked(nav.screen)} style={{...styles.Tabs,...{width:`${100/navContent.length}%`}}}>
                            <Icon name={nav.icon} size={24} color={nav.isSelected ? nav.selectedColor : '#d3d7dc'} /> 
                            <AppText style={{marginTop:5,textAlign:'center',color:nav.isSelected ? nav.selectedColor : '#d3d7dc'}}>{nav.name}</AppText>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    TabContainer:{
        width:'100%',
        height:55,
        backgroundColor:'white',
        flexDirection:'row',
        elevation:5
    },
    Tabs:{
        justifyContent:'center',
        alignItems: 'center',
    }
})


export default AppBottomTab
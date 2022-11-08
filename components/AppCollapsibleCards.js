import React,{useState} from 'react';
import { Text, View,StyleSheet, TouchableOpacity } from 'react-native';
import AppText from './AppText';
import Icon from 'react-native-vector-icons/Ionicons';

const AppCollapsibleCards = ({children,headingText,style}) => {
    const [hasCollapsed,setHasCollapsed] = useState(false)

    return(    
        <View style={{...styles.collapsibleCards,...style}}>
            <View style={styles.collapsibleCardsHeading}>
                <AppText style={styles.collapsibleCardsHeadingText}>{headingText}</AppText>
                    <TouchableOpacity onPress={()=>setHasCollapsed(!hasCollapsed)}>
                        <Icon name='caret-down' size={24} color="black" />
                    </TouchableOpacity>
                </View>
                
            {
                hasCollapsed ?
                
                children : 
                null
            }
        </View>
    );
    
}
const styles = StyleSheet.create({
    collapsibleCards:{
        width:'100%',
        backgroundColor:'white',
        elevation:5,
        borderRadius:5,
        padding:10,
        marginVertical:7
    },
    collapsibleCardsHeading:{
        height:35,
        width:'100%',
        borderBottomWidth:1,
        borderColor:'#ebedef',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    collapsibleCardsHeadingText:{
        fontSize:16,
        fontWeight:'bold'
    }
});

export default AppCollapsibleCards;

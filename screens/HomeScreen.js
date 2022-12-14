import React from "react";
import {View,StyleSheet,Image} from 'react-native'
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import AppCard from "../components/AppCard";
import AppContainer from "../components/AppContainer";
import AppText from "../components/AppText";
import AppTextBold from "../components/AppTextBold";

const HomeScreen = ({navigation}) => {
    return(
        <AppContainer style={{padding:10}}>
            <AppTextBold style={styles.ServiceContainerBoldText}>Services Categories</AppTextBold>
            <View style={styles.ServicesContainer}>
                <View style={{width:'48%'}}>
                    <TouchableOpacity style={{width:'100%'}} onPress={()=>navigation.navigate('SearchVoterScreen')}>
                        <AppCard style={{...styles.ServicesCardsSummary,...{backgroundColor:'#fa8072'}}}>
                            <Image source={require('../assets/images/search.png')}/>
                            <AppText style={styles.ServiceCardsText}>Search</AppText>    
                        </AppCard>
                    </TouchableOpacity>
                </View>
                <View style={{width:'48%'}}>
                    <TouchableOpacity style={{width:'100%'}} onPress={()=>navigation.navigate('VoterSummary')}>
                        <AppCard style={styles.ServicesCardsVisit}>
                            <Image source={require('../assets/images/candidates.png')}/>
                            <AppText style={styles.ServiceCardsText}>Voting Summary</AppText> 
                        </AppCard>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.ServicesContainer}>
                <View style={{width:'48%'}}>
                    <TouchableOpacity style={{width:'100%'}} onPress={()=>navigation.navigate('SummaryScreen')}>
                        <AppCard style={styles.ServicesCardsSummary}>
                            <Image source={require('../assets/images/summaryIcon.png')}/>
                            <AppText style={styles.ServiceCardsText}>Summary</AppText>    
                        </AppCard>
                    </TouchableOpacity>
                </View>
                <View style={{width:'48%'}}>
                    <TouchableOpacity style={{width:'100%'}} onPress={()=>navigation.navigate('VisitScreen')}>
                        <AppCard style={{...styles.ServicesCardsVisit,...{backgroundColor:'#ff6961'}}}>
                            <Image source={require('../assets/images/visitIcon.png')}/>
                            <AppText style={styles.ServiceCardsText}>Visits</AppText>    
                        </AppCard>
                    </TouchableOpacity>
                </View>
            </View>
        </AppContainer>
    )
}

const styles = StyleSheet.create({
    AppCard:{
        width:250,
        backgroundColor:'white',
        borderRadius:5,
        height:180,
        margin:10,
        marginLeft:1,
        flexDirection:'row',
        alignItems:'flex-start'
    },
    ServicesContainer:{
        width:'100%',
        flexDirection:'row',
        justifyContent: 'space-around'
    },
    ServiceContainerBoldText:{
        fontSize:15
    },
    ServicesContainerCardContainer:{
        width:'100%'
    },
    ServicesCardsVisit:{
        width:'100%',
        backgroundColor:'#8ecae6',
        borderRadius:5,
        height:160,
        margin:10,
        marginLeft:1,
        alignItems:'center'
    },
    ServicesCardsSummary:{
        width:'100%',
        backgroundColor:'#A0E8AF',
        borderRadius:5,
        height:160,
        margin:10,
        marginLeft:1,
        alignItems:'center'
    },
    ServiceCardsText:{
        fontSize:14,
        marginTop:10,
        fontWeight:"700"
    }
})


export default HomeScreen;

// <View style={styles.ServicesContainer}>
// <AppTextBold style={styles.ServiceContainerBoldText}>Services Categories</AppTextBold>
// <View style={styles.ServicesContainerCardContainer}>
//     <View style={{...styles.ServicesContainerCardContainer,...{flexDirection:'row',borderWidth:1}}}>
//         <TouchableOpacity style={{width:'50%'}} onPress={()=>navigation.navigate('SearchVoterScreen')}>
//             <AppCard style={{...styles.ServicesCardsSummary,...{backgroundColor:'#fa8072'}}}>
//                 <Image source={require('../assets/images/search.png')}/>
//                 <AppText style={styles.ServiceCardsText}>Search</AppText>    
//             </AppCard>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={()=>navigation.navigate('VoterSummary')}>
//             <AppCard style={styles.ServicesCardsVisit}>
//                 <Image source={require('../assets/images/candidates.png')}/>
//                 <AppText style={styles.ServiceCardsText}>Voting Summary</AppText>    
//             </AppCard>
//         </TouchableOpacity>
//     </View>
        
//         <TouchableOpacity onPress={()=>navigation.navigate('SummaryScreen')}>
//             <AppCard style={styles.ServicesCardsSummary}>
//                 <Image source={require('../assets/images/summaryIcon.png')}/>
//                 <AppText style={styles.ServiceCardsText}>Summary</AppText>    
//             </AppCard>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={()=>navigation.navigate('VisitScreen')}>
//             <AppCard style={styles.ServicesCardsVisit}>
//                 <Image source={require('../assets/images/visitIcon.png')}/>
//                 <AppText style={styles.ServiceCardsText}>Visits</AppText>    
//             </AppCard>
//         </TouchableOpacity>
   
// </View>
// </View>
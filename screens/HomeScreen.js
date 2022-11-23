import React from "react";
import {View,StyleSheet,Image} from 'react-native'
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import AppCard from "../components/AppCard";
import AppContainer from "../components/AppContainer";
import AppText from "../components/AppText";
import AppTextBold from "../components/AppTextBold";

const HomeScreen = ({navigation}) => {
    return(
        <AppContainer>
            <ScrollView>
            <View style={styles.ServicesContainer}>
                <AppTextBold style={styles.ServiceContainerBoldText}>Services Categories</AppTextBold>
                <View style={styles.ServicesContainerCardContainer}>
                    <ScrollView horizontal={true}>
                        <TouchableOpacity onPress={()=>navigation.navigate('SearchVoterScreen')}>
                            <AppCard style={{...styles.ServicesCardsSummary,...{backgroundColor:'#fa8072'}}}>
                                <Image source={require('../assets/images/search.png')}/>
                                <AppText style={styles.ServiceCardsText}>Search</AppText>    
                            </AppCard>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>navigation.navigate('VoterSummary')}>
                            <AppCard style={styles.ServicesCardsVisit}>
                                <Image source={require('../assets/images/candidates.png')}/>
                                <AppText style={styles.ServiceCardsText}>Voting Summary</AppText>    
                            </AppCard>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>navigation.navigate('SummaryScreen')}>
                            <AppCard style={styles.ServicesCardsSummary}>
                                <Image source={require('../assets/images/summaryIcon.png')}/>
                                <AppText style={styles.ServiceCardsText}>Summary</AppText>    
                            </AppCard>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>navigation.navigate('VisitScreen')}>
                            <AppCard style={styles.ServicesCardsVisit}>
                                <Image source={require('../assets/images/visitIcon.png')}/>
                                <AppText style={styles.ServiceCardsText}>Visits</AppText>    
                            </AppCard>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
            <View style={{width:'100%',padding:5,paddingLeft:15}}>
                <AppTextBold style={styles.ServiceContainerBoldText}>Top Videos</AppTextBold>
                <ScrollView horizontal={true}>
                    <AppCard style={styles.AppCard}>
                        <View style={{height:120,width:'100%'}}>
                            <Image source={require('../assets/images/mann.jpg')} style={{width:250,height:'100%'}}/>
                            <AppText style={{padding:5}}>
                                Share your idea's and suggestions for PM's upcomming Mann Ki Baat...
                            </AppText>
                        </View>
                    </AppCard>
                    <AppCard style={styles.AppCard}>
                        <View style={{height:120,width:'100%',alignItems:'center'}}>
                            <Image source={require('../assets/images/ppc.jpg')} style={{width:250,height:'100%'}}/>
                            <AppText style={{padding:5}}>
                                PM invites Participation for 'Pariksha par Charcha 2022'
                            </AppText>
                        </View>
                    </AppCard>
                    <AppCard style={styles.AppCard}>
                        <View style={{height:120,width:'100%',alignItems:'center'}}>
                            <Image source={require('../assets/images/merch.jpg')} style={{width:250,height:'100%'}}/>
                            <AppText style={{padding:5}}>
                                Get the latest Merchandise is here !!!!
                            </AppText>
                        </View>
                    </AppCard>
                   
                </ScrollView>
            </View>

            <View style={{width:'100%',padding:5,paddingLeft:15}}>
                <View style={{width:'100%',paddingRight:15}}>
                <AppTextBold style={styles.ServiceContainerBoldText}>Top News</AppTextBold>
                    <AppCard style={{...styles.AppCard,...{width:'100%',flexDirection:'column',height:500,justifyContent:'flex-start'}}}>
                        <View style={{padding:10}}>
                            <AppTextBold>PM extends best wishes to Barack Obama for quick recovery from COVID-19</AppTextBold>
                        </View>
                        <Image source={require('../assets/images/obama.jpg')} style={{width:'100%',height:'70%'}}/>
                        <View style={{padding:10}}>
                            <AppText>The Prime Minister,Shri Narendra Modi has extended his best wishes to former US President, barack Obama for his quick recovery from COVID-19</AppText>
                        </View>
                    </AppCard>
                </View>

                <View style={{width:'100%',paddingRight:15}}>
                    <AppCard style={{...styles.AppCard,...{width:'100%',flexDirection:'column',height:500,justifyContent:'flex-start'}}}>
                        <View style={{padding:10}}>
                            <AppTextBold>PM Modi chairs CCS meeting, seeks integrating latest technology in security apparatus</AppTextBold>
                        </View>
                        <Image source={require('../assets/images/ccs.jpg')} style={{width:'100%',height:'70%'}}/>
                        <View style={{padding:10}}>
                            <AppText>Prime Minister Narendra Modi on Sunday chaired a meeting of the Cabinet Committee on Security (CCS) to review India's security preparedness ....</AppText>
                        </View>
                    </AppCard>
                </View>
            </View> 
            </ScrollView>
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
        height:175,
        paddingTop:15,
        paddingLeft:15
    },
    ServiceContainerBoldText:{
        fontSize:15
    },
    ServicesContainerCardContainer:{
        width:'100%',
        flexDirection:'row'
    },
    ServicesCardsVisit:{
        width:120,
        backgroundColor:'#8ecae6',
        borderRadius:5,
        height:120,
        margin:10,
        marginLeft:1,
        alignItems:'center'
    },
    ServicesCardsSummary:{
        width:120,
        backgroundColor:'#A0E8AF',
        borderRadius:5,
        height:120,
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
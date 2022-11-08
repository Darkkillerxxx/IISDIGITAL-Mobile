import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import VisitScreen from '../screens/VisitScreen';
import AppBottomTab from '../components/AppBottomTab';
import VoterProfileScreen from '../screens/VoterProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import SearchVotersScreen from '../screens/SearchVotersScreen';
import SummaryScreen from '../screens/SummaryScreen';

const screens = createStackNavigator();
const bottomNav = createBottomTabNavigator();

const getScreens = (screen) => {
    switch(screen){
        case "HomeScreen":
            return HomeScreen
        
        case "SettingScreen":
            console.log(18,screen)
            return SettingScreen

        default:
            return HomeScreen
    }
}

const BottomNavigator = ({route}) =>{
    return(
        <bottomNav.Navigator tabBar = {props => <AppBottomTab navContent={route.params.bottomNavigatorContent} {...props}/>} screenOptions={{ headerShown: false }}>
                 {route.params.bottomNavigatorContent.map((bottomTabs)=>{
                    return(
                        <bottomNav.Screen name={bottomTabs.title} component={getScreens(bottomTabs.screen)} /> 
                    )
                })}
        </bottomNav.Navigator>
    )
}

const StackScreen = ({Drawer,bottomNavigatorContent}) => {
    return(
        <screens.Navigator initialRouteName='BottomNavigator'>
            <screens.Screen options={{
                            title:'HomeScreen',  
                            headerShown:false
                            }} 
                            name='HomeScreen' 
                            component={HomeScreen}/>
            
            <screens.Screen options={{
                            title:'VoterProfileScreen',  
                            headerShown:false
                            }} 
                            name='VoterProfileScreen' 
                            component={VoterProfileScreen}/>

            <screens.Screen options={{
                            title:'VisitScreen',  
                            headerShown:false
                            }} 
                            name='VisitScreen' 
                            component={VisitScreen}/>
            
            <screens.Screen options={{
                            title:'SearchVoterScreen',  
                            headerShown:false
                            }} 
                            name='SearchVoterScreen' 
                            component={SearchVotersScreen}/>

             <screens.Screen options={{
                            title:'SummaryScreen',  
                            headerShown:false
                            }} 
                            name='SummaryScreen' 
                            component={SummaryScreen}/>

             <screens.Screen options={{
                            title:'BottomNavigator',  
                            headerShown:false
                            }} 
                            name='BottomNavigator' 
                            component={BottomNavigator}
                            initialParams={{bottomNavigatorContent:bottomNavigatorContent}}
                            />

        </screens.Navigator>
    )
}

const PostAuthScreen = ({Drawer,bottomNavigator})=>{
    return(
        <NavigationContainer >
            <StackScreen bottomNavigatorContent={bottomNavigator}/>
        </NavigationContainer>
    ) 
}


export default PostAuthScreen
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginForm from '../screens/LoginForm';
import OtpScreen from '../screens/OtpScreen';


const screens = createStackNavigator();

const StackScreen = () => {
    return(
        <screens.Navigator initialRouteName='Drawer'>
              <screens.Screen 
                    options={{title: 'Login',swipeEnabled: false,headerShown:false}} 
                    name="LoginForm" 
                    component={LoginForm}
            />  
            <screens.Screen 
                    options={{title: 'OTP',swipeEnabled: false,headerShown:false}} 
                    name="OTP" 
                    component={OtpScreen}
            />        
        </screens.Navigator>
    )
}

const PreAuthScreens = () => (
    <NavigationContainer>
        <StackScreen/>
    </NavigationContainer>
);

export default PreAuthScreens;
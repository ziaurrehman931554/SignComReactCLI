import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Button,
  Platform,
} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import {useUser, useStyle} from '../AppContext';

import HomeScreen from './HomeScreen';
import CallScreen from './CallScreen';
import HistoryScreen from './HistoryScreen';
import AccountScreen from './AccountScreen';
import CallingScreen from './CallingScreen';
import SettingsScreen from './SettingsScreen';
import AboutScreen from './AboutScreen';
import DrawerScreen from './DrawerScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();

interface HomeProps {
  onLogout: () => void;
  userToken: string;
  reset: () => void;
}

export default function Home({onLogout, userToken, reset}: HomeProps) {
  const {appStyles, toggleAppColor} = useStyle();
  const {findUserByEmail} = useUser();
  const users: any = findUserByEmail(userToken);
  const [user, setUser] = useState<any>('');

  function CallHome({navigation}: any) {
    return (
      // <Text>CallHome</Text>
      <HomeScreen userToken={users} store={store} navigation={navigation} />
    );
  }

  function CallCall({navigation}: any) {
    return (
      // <Text>CallHome</Text>
      <CallScreen navigation={navigation} />
    );
  }

  function CallHistory({navigation}: any) {
    return (
      // <Text>CallHome</Text>
      <HistoryScreen userToken={users} navigation={navigation} />
    );
  }

  function CallAccount({navigation}: any) {
    return (
      // <Text>CallHome</Text>
      <AccountScreen
        userToken={users}
        onLogout={onLogout}
        navigation={navigation}
      />
    );
  }

  function CallSetting({navigation}: any) {
    return (
      // <Text>CallHome</Text>
      <SettingsScreen userToken={users} navigation={navigation} />
    );
  }

  function MainScreen() {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
            let imageSource;
            let imageSize = 30;
            const imageOpacity = focused ? 1 : 0.5;
            if (route.name === 'Home') {
              imageSource = require('../assets/home.png');
            } else if (route.name === 'Call') {
              imageSource = require('../assets/call.png');
            } else if (route.name === 'History') {
              imageSource = require('../assets/history.png');
            } else if (route.name === 'Account') {
              imageSource = require('../assets/Profile.png');
            }
            return (
              <View
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  overflow: 'hidden',
                  borderTopLeftRadius: 25,
                  borderTopRightRadius: 25,
                }}>
                <Image
                  source={imageSource}
                  style={{
                    width: imageSize,
                    height: imageSize,
                    opacity: imageOpacity,
                  }}
                />
                {focused && <Text style={{fontSize: 7}}>{route.name}</Text>}
                {focused && (
                  <View
                    style={{
                      zIndex: -1,
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      height: '90%',
                      backgroundColor: '#5264BE',
                      borderTopLeftRadius: 25,
                      borderTopRightRadius: 25,
                    }}
                  />
                )}
              </View>
            );
          },
          tabBarHideOnKeyboard: true,
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
          tabBarStyle: {
            position: 'absolute',
            margin: 15,
            marginBottom: Platform.OS === 'ios' ? 20 : 15,
            borderRadius: 30,
            paddingBottom: Platform.OS === 'ios' ? -20 : 5,
            height: Platform.OS === 'ios' ? 85 : 75,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: '#8EDFEB',
          },
          tabBarShowLabel: false,
        })}>
        <Tab.Screen
          name="Home"
          component={CallHome}
          options={{headerShown: false, tabBarLabel: ''}}
        />
        <Tab.Screen
          name="Call"
          component={CallCall}
          options={{headerShown: false, tabBarLabel: ''}}
        />
        <Tab.Screen
          name="History"
          component={CallHistory}
          options={{headerShown: false, tabBarLabel: ''}}
        />
        <Tab.Screen
          name="Account"
          component={CallAccount}
          options={{headerShown: false, tabBarLabel: ''}}
        />
      </Tab.Navigator>
    );
  }

  function store({userItem}: any) {
    setUser(userItem);
  }

  function CallDrawer({navigation}: any) {
    return (
      // <Text>CallHome</Text>
      <DrawerScreen navigation={navigation} user={users} onLogout={onLogout} />
    );
  }

  function CallCalling({navigation, route}: any) {
    return (
      // <Text>CallHome</Text>
      <CallingScreen navigation={navigation} userToken={users} route={route} />
    );
  }

  function CallAbout({navigation}: any) {
    return (
      // <Text>CallHome</Text>
      <AboutScreen navigation={navigation} />
    );
  }

  function MainNavigator() {
    return (
      <Stack.Navigator initialRouteName="MainScreen">
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MakeCall"
          component={CallCalling}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="Settings"
          component={CallSetting}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="About"
          component={CallAbout}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Drawer"
          component={CallDrawer}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            gestureEnabled: false,
            cardStyle: {
              backgroundColor: 'transparent',
            },
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    // <Text>abc</Text>
    <>{<MainNavigator />}</>
  );
}

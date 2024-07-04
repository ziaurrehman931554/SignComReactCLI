/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable quotes */
import React, {useEffect, useState} from 'react';
import {useStyle} from '../AppContext';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {onAuthStateChanged} from 'firebase/auth';
import {FIREBASE_AUTH} from '../FirebaseConfig';

import Home from './Home';
import Login from './Login';

interface MainAppProps {
  reset: () => void;
}

export default function MainApp({reset}: MainAppProps) {
  const [user, setUser]: any = useState();
  const {appStyles} = useStyle();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState<string>('');

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setUserToken(storedToken);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    }
    onAuthStateChanged(FIREBASE_AUTH, user => {
      console.log('user', user);
      setUser(user);
    });
    checkAuthentication();
  }, []);

  const handleLogin = (email: string) => {
    setUserToken(email);
    AsyncStorage.setItem('userToken', email)
      .then(() => setIsAuthenticated(true))
      .catch(error => console.error('Error saving token:', error));
  };

  const handleLogout = () => {
    AsyncStorage.removeItem('userToken')
      .then(() => setIsAuthenticated(false))
      .catch(error => console.error('Error removing token:', error));
    FIREBASE_AUTH.signOut();
  };

  return (
    <View style={[appStyles.container, appStyles.background]}>
      {isAuthenticated && user ? (
        <Home onLogout={handleLogout} userToken={userToken} />
      ) : (
        // <Home onLogout={handleLogout} userToken={'zr931554@gmail.com'} /> //remove when done
        <Login onLogin={handleLogin} reset={reset} />
      )}
    </View>
  );
}

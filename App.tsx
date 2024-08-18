import React from 'react';
import {AppProvider} from './AppContext';
import AppContainer from './AppContainer';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <AppProvider>
          <AppContainer />
        </AppProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

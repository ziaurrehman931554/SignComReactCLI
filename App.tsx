import React from 'react';
import {AppProvider} from './AppContext';
import AppContainer from './AppContainer';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <AppProvider>
        <AppContainer />
      </AppProvider>
    </NavigationContainer>
  );
}

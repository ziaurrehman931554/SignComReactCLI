import React from 'react';

import {AppProvider} from './AppContext';
import AppContainer from './AppContainer';

export default function App() {
  return (
    <AppProvider>
      <AppContainer />
    </AppProvider>
  );
}

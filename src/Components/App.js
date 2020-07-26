import React, { createContext, useState } from 'react';
import './../Styles/App.scss';
import { Converter } from './Converter';
import { Trends } from './Trends';

export const AppContext = createContext()
export const App = () => {

  const [appState, setAppState] = useState({
    graphCurrency: 'SEK'
  })

  return (
    <AppContext.Provider value={{state:appState, setState:setAppState}}>
      <div className="App">
        <Converter />
        <Trends />
      </div>
    </AppContext.Provider>
  );
};
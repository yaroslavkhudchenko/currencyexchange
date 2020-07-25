import React from 'react';
import './../Styles/App.scss';
import { Converter } from './Converter';
import { Trends } from './Trends';

export const App = () =>
    <div className="App">
      <Converter />
      <Trends />
    </div>
  
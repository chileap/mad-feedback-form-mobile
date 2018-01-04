import React, { Component } from 'react';

import {
  StackNavigator
} from 'react-navigation';

import Home from './pages/Home';
import ThankYou from './pages/ThankYou';

const App = StackNavigator({
  Home: {
    screen: Home
  },
  ThankYou: {
    screen: ThankYou
  },
});

export default App;

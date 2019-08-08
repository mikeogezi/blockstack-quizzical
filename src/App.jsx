import React from 'react';

import './App.css';
import 'typeface-roboto';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Routes from './components/Routes';

import { 
  AppProvider,
  AppContext
} from './components/AppContext';

import { 
  BrowserRouter as Router, 
  // Link
} from 'react-router-dom';
import { UserSession } from 'blockstack';
import { Box } from '@material-ui/core';

window.UserSession = UserSession;

export default class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {};
  }

  render () {
    return (
      <AppProvider onAuthStateChanged={this._onAuthStateChanged}>
        <Router>
          <Navbar />
          <Box m={2}>
            <Routes />
          </Box>
          {/* <Footer /> */}
        </Router>
      </AppProvider>
    );
  }
};

App.contextType = AppContext;
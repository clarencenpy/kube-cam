'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './app.css';
import LiveCam from './components/LiveCam';
import Navigation from './components/Navigation';

class App extends Component {
  render() {
    return (
      <div id="app">
        <Navigation />
        <LiveCam />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

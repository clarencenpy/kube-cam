'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './app.css';
import KubeCam from './components/KubeCam';

class App extends Component {
  render() {
    return (
      <KubeCam />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

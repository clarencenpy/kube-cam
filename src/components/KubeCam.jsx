'use strict';

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LiveCam from './LiveCam';
import HistoryCam from './HistoryCam';

class KubeCam extends React.Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={LiveCam} />
          <Route path='/history' component={HistoryCam} />
        </Switch>
      </main>
    );
  }
}

export default KubeCam;

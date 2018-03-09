'use strict';

import React from 'react';
import Vizceral from 'vizceral-react';
import LiveTrafficData from '../controllers/LiveTrafficData';

class LiveCam extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: [],
      displayOptions: {
        showLabels: true,
      },
      physicsOptions: undefined,
      filters: [],
      searchTerm: undefined,
      modes: undefined,
    };

    this.interval = undefined;

    this.traffic = new LiveTrafficData();
  }


  componentDidMount() {
    this.interval = setInterval(() => {
      this.updateTrafficData();
    }, 5000);
  }


  componentWillUnmount() {
    clearInterval(this.interval);
  }


  updateTrafficData() {
    this.traffic.updateLiveTrafficData(this.setState.bind(this));
  }


  render() {
    return (
      <div id="vizceral-container">
        <Vizceral
          traffic={this.state.trafficData}
          view={this.state.currentView}
          showLabels={this.state.displayOptions.showLabels}
          physicsOptions={this.state.physicsOptions}
          filters={this.state.filters}
          viewChanged={this.viewChanged}
          viewUpdated={this.viewUpdated}
          objectHighlighted={this.objectHighlighted}
          nodeContextSizeChanged={this.nodeContextSizeChanged}
          matchesFound={this.matchesFound}
          match={this.state.searchTerm}
          modes={this.state.modes}
        />
      </div>
    );
  }
}

export default LiveCam;

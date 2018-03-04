'use strict';

import React from 'react';
import Vizceral from 'vizceral-react';
import LiveTrafficData from '../controllers/LiveTrafficData';

class KubeCam extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      trafficData: {
        renderer: 'region',
        name: 'edge',
        maxVolume: 10,
        entryNode: 'INTERNET',
        nodes: [
          {
            name: 'INTERNET',
          },
          {
            renderer: 'region',
            layout: 'ltrTree',
            name: 'stuff',
            updated: 1462471847,
            maxVolume: 10,
          },
        ],
        connections: [
          {
            source: 'INTERNET',
            target: 'stuff',
            metrics: {
              normal: 5000,
              danger: 5,
              warning: 0,
            },
            notices: [],
            metadata: {},
          },
        ],
      },
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
      <div id="ugh">
        <div id="hi">
          <h1>Hi</h1>
        </div>
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
      </div>
    );
  }
}

export default KubeCam;

'use strict';

import React from 'react';
import Vizceral from 'vizceral-react';

class KubeCam extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      trafficData: {
        renderer: 'region',
        name: 'edge',
        maxVolume: 100000,
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
            maxVolume: 100000,
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

'use strict';

import React from 'react';
import { Grid, Col } from 'react-bootstrap';
import Vizceral from 'vizceral-react';
import LiveTrafficData from '../controllers/LiveTrafficData';
import DetailsPanel from './DetailsPanel';

class LiveCam extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: [],
      displayOptions: {
        showLabels: true,
        allowDraggingOfNodes: true,
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


  objectHighlighted = (object) => {
    if (object.type === 'node') {
      this.setState({ objectToHighlight: object.getName() });
    }
  };


  render() {
    const leftCol = this.state.objectToHighlight ? 8 : 12;
    const rightCol = this.state.objectToHighlight ? 4 : 0;
    return (
      <Grid>
        <Col md={leftCol}>
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
            allowDraggingOfNodes={this.state.displayOptions.allowDraggingOfNodes}
          />
        </Col>
        <Col md={rightCol}>
          {
            this.state.objectToHighlight &&
            <DetailsPanel
              details={this.state.details}
              highlightedNode={this.state.objectToHighlight}
            />
          }
        </Col>
      </Grid>
    );
  }
}

export default LiveCam;

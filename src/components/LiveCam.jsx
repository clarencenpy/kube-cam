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
      leftCol: 12,
      rightCol: 0,
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
    if (object !== undefined && object.type === 'node') {
      this.setState({ objectToHighlight: object.getName(), leftCol: 8, rightCol: 4 });
    } else {
      this.setState({ objectToHighlight: undefined, leftCol: 12, rightCol: 0 });
    }
  };


  render() {
    return (
      <Grid>
        <Col md={this.state.leftCol}>
          <Vizceral
            traffic={this.state.trafficData}
            view={this.state.currentView}
            showLabels={this.state.displayOptions.showLabels}
            physicsOptions={this.state.physicsOptions}
            objectHighlighted={this.objectHighlighted}
            objectToHighlight={this.state.objectToHighlight}
            allowDraggingOfNodes={this.state.displayOptions.allowDraggingOfNodes}
          />
        </Col>
        <Col md={this.state.rightCol}>
          {
            this.state.objectToHighlight &&
            <DetailsPanel
              details={this.state.details}
              highlightedNode={this.state.objectToHighlight}
              objectHighlighted={this.objectHighlighted}
            />
          }
        </Col>
      </Grid>
    );
  }
}

export default LiveCam;

'use strict';

import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import Vizceral from 'vizceral-react';
import DetailsPanel from './DetailsPanel';
import Nodecrumb from './Nodecrumb';
import LiveTrafficData from '../controllers/LiveTrafficData';

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


  viewChanged = (object) => {
    // Should only go at most one layer deep to see diff versions of a service
    if (this.state.currentView.length < 1) {
      this.setState({ currentView: object.view });
    }
  }


  viewUpdated = () => {
    this.setState({});
  }


  navigateHome = () => {
    let currentView = [];
    if (this.state.currentView.length === 1) {
      currentView = [this.state.currentView[0]];
    }
    currentView.pop();
    this.setState({ currentView: currentView });
  }


  render() {
    return (
      <Grid>
        <Nodecrumb
          path={this.state.currentView}
          navigateHome={this.navigateHome}
        />
        <Row>
          <Col md={this.state.leftCol}>
            <Vizceral
              traffic={this.state.trafficData}
              view={this.state.currentView}
              showLabels={this.state.displayOptions.showLabels}
              physicsOptions={this.state.physicsOptions}
              objectHighlighted={this.objectHighlighted}
              objectToHighlight={this.state.objectToHighlight}
              allowDraggingOfNodes={this.state.displayOptions.allowDraggingOfNodes}
              viewChanged={this.viewChanged}
              viewUpdated={this.viewUpdated}
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
        </Row>
      </Grid>
    );
  }
}

export default LiveCam;

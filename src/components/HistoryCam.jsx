'use strict';

import React from 'react';
import { Grid, Col, Panel, Row } from 'react-bootstrap';
import Vizceral from 'vizceral-react';
import DetailsPanel from './DetailsPanel';
import HistoricalTrafficData from '../controllers/HistoricalTrafficData';
import Nodecrumb from './Nodecrumb';
import TimePicker from './TimePicker';

class HistoryCam extends React.Component {
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
      currentTimeShown: undefined,
    };

    this.traffic = new HistoricalTrafficData();
    this.updateData = this.updateTrafficData.bind(this);
  }


  updateTrafficData(startTime, endTime) {
    this.traffic.updateTrafficData(startTime, endTime, this.setState.bind(this));
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
        <Row>
          <Col md={12}>
            <TimePicker onSelectTime={this.updateData} />
          </Col>
        </Row>
        <Row>
          <Nodecrumb
            path={this.state.currentView}
            navigateHome={this.navigateHome}
          />
        </Row>
        {
          this.state.currentTimeShown &&
          <Row>
            <Panel>
              <Panel.Body>{this.state.currentTimeShown}</Panel.Body>
            </Panel>
          </Row>
        }
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

export default HistoryCam;

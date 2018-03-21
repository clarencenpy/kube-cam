'use strict';

import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import Vizceral from 'vizceral-react';
import DetailsPanel from './DetailsPanel';
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
    };
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
            <TimePicker onSelectTime={this.updateTrafficData} />
          </Col>
        </Row>
        <Row>
          <Nodecrumb
            path={this.state.currentView}
            navigateHome={this.navigateHome}
          />
        </Row>
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

'use strict';

import React from 'react';
import { Alert, Button, Col, ControlLabel, FormGroup } from 'react-bootstrap';
import Datetime from 'react-datetime';

import './TimePicker.css';

const moment = require('moment');

class TimePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: '',
      endTime: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStartTime = this.handleStartTime.bind(this);
    this.handleEndTime = this.handleEndTime.bind(this);
  }


  handleSubmit(event) {
    if (this.state.startTime.isBefore(this.state.endTime) &&
     this.state.endTime.isBefore(moment())) {
      this.props.onSelectTime(this.state.startTime, this.state.endTime);
    } else {
      this.setState({ errorInvalidTime: 'You selected an invalid time range.' });
    }
    event.preventDefault();
  }


  handleStartTime(timeObj) {
    this.setState({ startTime: timeObj });
  }


  handleEndTime(timeObj) {
    this.setState({ endTime: timeObj });
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.state.errorInvalidTime !== undefined &&
          <Alert bsStyle='danger'>{this.state.errorInvalidTime}</Alert>
        }
        <Col md={3}>
          <FormGroup>
            <ControlLabel>Start Time (UTC):</ControlLabel>
            <Datetime value={this.state.startTime} onChange={this.handleStartTime} utc={true} />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <ControlLabel>End Time (UTC):</ControlLabel>
            <Datetime value={this.state.endTime} onChange={this.handleEndTime} utc={true} />
          </FormGroup>
        </Col>
        <br />
        <Button type='submit' bsStyle='primary'>Submit</Button>
      </form>
    );
  }
}

TimePicker.propTypes = {
  onSelectTime: React.PropTypes.func.isRequired,
};

export default TimePicker;

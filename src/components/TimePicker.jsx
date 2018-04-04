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
    if (this.isValidTimeRange()) {
      this.setState({ errorInvalidTime: undefined });
      this.props.onSelectTime(this.state.startTime, this.state.endTime);
    } else {
      this.setState({ errorInvalidTime: 'You selected an invalid time range.' });
    }
    event.preventDefault();
  }


  isValidTimeRange() {
    // Times from more than 6 hours ago are not valid due to data retention
    // https://prometheus.io/docs/prometheus/latest/storage/#operational-aspects
    const timeFromPresent = moment().diff(this.state.startTime, 'minutes');
    const sixHours = 60 * 6;
    if (timeFromPresent > sixHours) {
      return false;
    }

    return this.state.startTime.isBefore(this.state.endTime) &&
     this.state.endTime.isBefore(moment());
  }


  handleStartTime(timeObj) {
    this.setState({ startTime: timeObj });
  }


  handleEndTime(timeObj) {
    this.setState({ endTime: timeObj });
  }


  handleDismiss = () => {
    this.setState({ errorInvalidTime: undefined });
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.state.errorInvalidTime !== undefined &&
          <Alert bsStyle='danger' onDismiss={this.handleDismiss}>
            {this.state.errorInvalidTime}
          </Alert>
        }
        <Col md={3}>
          <FormGroup>
            <ControlLabel className='times'>Start Time (UTC):</ControlLabel>
            <Datetime value={this.state.startTime} onChange={this.handleStartTime} utc />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <ControlLabel className='times'>End Time (UTC):</ControlLabel>
            <Datetime value={this.state.endTime} onChange={this.handleEndTime} utc />
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

'use strict';

import PrometheusClient from '../clients/PrometheusClient';

const moment = require('moment');

class LiveTrafficData {
  constructor() {
    this.requestRate = 5;

    this.prometheusClient = new PrometheusClient();
  }

  updateLiveTrafficData(updateState) {
    const startTime = this.getWindowStartTimeInISOFOrmat();
    const endTime = this.getWindowEndTimeInISOFormat();
    this.prometheusClient.getTrafficData(startTime, endTime, this.requestRate, updateState);
  }

  getWindowStartTimeInISOFOrmat() {
    return moment().subtract(this.requestRate, 'seconds').toISOString();
  }

  getWindowEndTimeInISOFormat() {
    return moment().toISOString();
  }
}

export default LiveTrafficData;

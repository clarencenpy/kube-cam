'use strict';

import DetailsPanel from './DetailsPanel';
import PrometheusClient from '../clients/PrometheusClient';
import TrafficFlow from './TrafficFlow';

const moment = require('moment');

class LiveTrafficData {
  constructor() {
    this.requestRate = 5;

    this.detailsPanel = new DetailsPanel();
    this.prometheusClient = new PrometheusClient();
    this.trafficFlow = new TrafficFlow();
  }


  updateLiveTrafficData(updateState) {
    const startTime = this.getWindowStartTimeInISOFOrmat();
    const endTime = this.getWindowEndTimeInISOFormat();

    const buildAndUpdateTrafficWrapper = setState => (err, resp, body) =>
      this.buildAndUpdateTraffic(err, resp, body, setState);
    this.prometheusClient.getTrafficData(startTime, endTime, this.requestRate,
      buildAndUpdateTrafficWrapper(updateState));
  }


  getWindowStartTimeInISOFOrmat() {
    return moment().subtract(this.requestRate, 'seconds').toISOString();
  }


  getWindowEndTimeInISOFormat() {
    return moment().toISOString();
  }


  buildAndUpdateTraffic(err, resp, body, setState) {
    if (err) {
      console.log(err);
    } else {
      const jsonBody = JSON.parse(body);

      const trafficData = this.trafficFlow.buildTrafficDataObject(jsonBody);
      const detailsPanelData = this.detailsPanel.buildDetailsPanelObject(jsonBody);

      setState({ trafficData: trafficData, details: detailsPanelData });
    }
  }
}

export default LiveTrafficData;

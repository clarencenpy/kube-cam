const moment = require('moment');
const DetailsPanel = require('./DetailsPanelController');
const PrometheusClient = require('../clients/PrometheusClient');
const TrafficFlow = require('./TrafficFlowController');

class LiveTrafficController {
  constructor() {
    this.requestRate = 5;

    this.detailsPanel = new DetailsPanel();
    this.prometheusClient = new PrometheusClient();
    this.trafficFlow = new TrafficFlow();
  }

  getCurrentTraffic(callback) {
    const startTime = this.getWindowStartTimeInISOFOrmat();
    const endTime = this.getWindowEndTimeInISOFormat();

    const buildAndUpdateTrafficWrapper = sendResponse => (err, resp, body) =>
      this.buildAndUpdateTraffic(err, resp, body, sendResponse);
    this.prometheusClient.getTrafficData(startTime, endTime, this.requestRate,
      buildAndUpdateTrafficWrapper(callback));
  }


  getWindowStartTimeInISOFOrmat() {
    return moment().subtract(this.requestRate, 'seconds').toISOString();
  }


  getWindowEndTimeInISOFormat() {
    return moment().toISOString();
  }


  buildAndUpdateTraffic(err, resp, body, callback) {
    if (err) {
      console.log(err);
    } else {
      const jsonBody = JSON.parse(body);

      const trafficData = this.trafficFlow.buildTrafficDataObject(jsonBody);
      const detailsPanelData = this.detailsPanel.buildDetailsPanelObject(jsonBody);

      callback({ trafficData: trafficData, details: detailsPanelData });
    }
  }
}

module.exports = LiveTrafficController;

const DetailsPanel = require('./DetailsPanelController');
const PrometheusClient = require('../clients/PrometheusClient');
const TrafficFlow = require('./TrafficFlowController');

class HistoricalTrafficController {
  constructor() {
    this.requestRate = 5;

    this.detailsPanel = new DetailsPanel();
    this.prometheusClient = new PrometheusClient();
    this.trafficFlow = new TrafficFlow();
  }


  getTrafficDataByTimePeriod(start, end, callback) {
    const startTimeStr = start.toISOString();
    const endTimeStr = end.toISOString();

    const buildAndUpdateTrafficWrapper = (setState, startTime, endTime) =>
      (err, resp, body) => this.buildAndUpdateTraffic(err, resp, body, setState,
        startTime, endTime);
    this.prometheusClient.getTrafficData(startTimeStr, endTimeStr, this.requestRate,
      buildAndUpdateTrafficWrapper(callback, start, end));
  }


  buildAndUpdateTraffic(err, resp, body, callback, startTime, endTime) {
    if (err) {
      console.log(err);
    } else {
      const jsonBody = JSON.parse(body);

      const trafficData = this.trafficFlow.buildTrafficDataObject(jsonBody);
      const detailsPanelData = this.detailsPanel.buildDetailsPanelObject(jsonBody);
      const startTimeStr = startTime.toISOString();
      callback({
        trafficData: trafficData,
        details: detailsPanelData,
        currentTimeShown: startTimeStr,
        startTime: startTime,
        endTime: endTime,
      });
    }
  }
}

module.exports = HistoricalTrafficController;

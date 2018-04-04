'use strict';

import DetailsPanel from './DetailsPanel';
import PrometheusClient from '../clients/PrometheusClient';
import TrafficFlow from './TrafficFlow';

class HistoricalTrafficData {
  constructor() {
    this.requestRate = 5;

    this.detailsPanel = new DetailsPanel();
    this.prometheusClient = new PrometheusClient();
    this.trafficFlow = new TrafficFlow();
  }


  updateTrafficData(start, end, updateState) {
    const startTimeStr = start.toISOString();

    const buildAndUpdateTrafficWrapper = (setState, startTime, endTime) =>
      (err, resp, body) => this.buildAndUpdateTraffic(err, resp, body, setState,
        startTime, endTime);
    const windowStart = startTimeStr;
    const windowEnd = start.add(this.requestRate, 'seconds').toISOString();
    this.prometheusClient.getTrafficData(windowStart, windowEnd, this.requestRate,
      buildAndUpdateTrafficWrapper(updateState, start, end));
  }


  buildAndUpdateTraffic(err, resp, body, setState, startTime, endTime) {
    if (err) {
      console.log(err);
    } else {
      const jsonBody = JSON.parse(body);

      const trafficData = this.trafficFlow.buildTrafficDataObject(jsonBody);
      const detailsPanelData = this.detailsPanel.buildDetailsPanelObject(jsonBody);
      const startTimeStr = startTime.toISOString();
      startTime = startTime.add(this.requestRate, 'seconds');
      setState({
        trafficData: trafficData,
        details: detailsPanelData,
        currentTimeShown: startTimeStr,
        startTime: startTime,
        endTime: endTime,
      });
    }
  }
}

export default HistoricalTrafficData;

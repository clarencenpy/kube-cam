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
    if (start.isSame(end)) {
      return;
    }
    const startTimeStr = start.toISOString();
    const endTimeStr = end.toISOString();

    const buildAndUpdateTrafficWrapper = (setState, startTime, endTime) =>
      (err, resp, body) => this.buildAndUpdateTraffic(err, resp, body, setState,
        startTime, endTime);

    this.prometheusClient.getTrafficData(startTimeStr, endTimeStr, this.requestRate,
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
      setState({ trafficData: trafficData, details: detailsPanelData,
         currentTimeShown: startTimeStr },
        () => {
          console.log(startTimeStr);
          console.log(trafficData);
          startTime = startTime.add(this.requestRate, 'seconds');
          this.updateTrafficData(startTime, endTime, setState);
        });
    }
  }
}

export default HistoricalTrafficData;

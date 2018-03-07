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
      const ingressName = 'ingress.istio-system.svc.cluster.local';

      const trafficData = {};

      const nodes = [];
      const connections = [];

      const jsonBody = JSON.parse(body);

      for (let i = 0; i < jsonBody.data.result.length; i += 1) {
        const currentItem = jsonBody.data.result[i];
        const currentMetric = currentItem.metric;
        const currentValues = currentItem.values;

        const node = {};
        // TODO: have some differentiation based on versions
        const destinationService = currentMetric.destination_service;
        const sourceService = currentMetric.source_service;

        const responseCode = currentMetric.response_code;

        const oldViewCount = currentValues[0][1];
        const newViewCount = currentValues[1][1];
        const trafficSeen = newViewCount - oldViewCount;

        // Update node data
        if (trafficSeen !== 0 && responseCode !== 200) {
          // TODO: Some error, render error at the node
        }
        node.renderer = 'region';
        node.layout = 'ltrTree';
        node.name = destinationService;
        node.updated = 1462471847;
        node.maxVolume = 10;
        nodes.push(node);

        // Update edge data
        const connection = {};
        if (sourceService === ingressName) {
          connection.source = 'INTERNET';
        } else {
          connection.source = sourceService;
        }
        connection.target = destinationService;

        // TODO: Fix this to render a more appropriate edge density
        connection.metrics = { normal: 1, danger: 1, warning: 1 };
        connection.notices = [];
        connection.metadata = {};
        connections.push(connection);
      }

      // Create node representing ingress
      const ingressNode = { name: 'INTERNET' };
      nodes.push(ingressNode);

      trafficData.nodes = nodes;
      trafficData.connections = connections;

      // Add ingress and other mandatory details
      trafficData.renderer = 'region';
      trafficData.name = 'edge';
      trafficData.maxVolume = 10;
      trafficData.entryNode = 'INTERNET';
      trafficData.nodes = nodes;
      trafficData.displayOptions = { showLabels: true };
      setState({ trafficData: trafficData });
    }
  }
}

export default LiveTrafficData;

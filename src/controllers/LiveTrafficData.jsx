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
      const jsonBody = JSON.parse(body);

      const trafficData = this.buildTrafficDataObject(jsonBody);
      const detailsPanelData = this.buildDetailsPanelObject(jsonBody);
      setState({ trafficData: trafficData, detailsPanel: detailsPanelData });
    }
  }


  buildDetailsPanelObject(body) {
  }


  buildTrafficDataObject(body) {
    const trafficData = {};

    const nodes = [];
    const connections = [];

    for (let i = 0; i < body.data.result.length; i += 1) {
      const currentItem = body.data.result[i];
      const currentMetric = currentItem.metric;
      const currentValues = currentItem.values;

      const destinationService = currentMetric.destination_service;
      let sourceService = currentMetric.source_service;
      if (sourceService === 'ingress.istio-system.svc.cluster.local') {
        sourceService = 'INTERNET';
      }

      const responseCode = currentMetric.response_code;

      // Calculate number of requests seen in the latest time period
      const oldViewCount = parseInt(currentValues[0][1], 10);
      const newViewCount = parseInt(currentValues[1][1], 10);
      const trafficSeen = newViewCount - oldViewCount;

      // Seems to only create nodes in the graph for destination services
      // So unless the source appears as a destination service somewhere else it won't render
      // Source names given by Prometheus is the name of the deployment and not the service
      const node = this.getNode(destinationService, nodes);
      const connection = this.getConnection(sourceService, destinationService, connections);

      this.updateConnectionMetrics(connection.metrics, responseCode, trafficSeen);

      node.renderer = 'region';
      node.layout = 'ltrTree';
      node.name = destinationService;
      node.maxVolume = 10000;
      nodes.push(node);

      connection.source = sourceService;
      connection.target = destinationService;

      connections.push(connection);
    }

    // Create node representing ingress
    const ingressNode = { name: 'INTERNET' };
    nodes.push(ingressNode);

    // Add ingress and other mandatory details
    trafficData.renderer = 'region';
    trafficData.name = 'edge';
    trafficData.maxVolume = 10;
    trafficData.entryNode = 'INTERNET';
    trafficData.nodes = nodes;
    trafficData.displayOptions = { showLabels: true };
    trafficData.nodes = nodes;
    trafficData.connections = connections;
    return trafficData;
  }


  getNode(serviceName, nodes) {
    for (let i = 0; i < nodes.length; i += 1) {
      if (nodes[i].name === serviceName) {
        const node = nodes[i];
        nodes.splice(i, 1);
        return node;
      }
    }
    return {};
  }


  getConnection(currSource, currDest, connections) {
    for (let i = 0; i < connections.length; i += 1) {
      const edgeSource = connections[i].source;
      const edgeDest = connections[i].target;
      if (edgeDest === currDest && currSource === edgeSource) {
        const connection = connections[i];
        connections.splice(i, 1);
        return connection;
      }
    }
    const metrics = { normal: 0, warning: 0, danger: 0 };
    return { metrics };
  }


  updateConnectionMetrics(metrics, responseCode, seen) {
    const type = responseCode.charAt(0);

    const ResponseCode = {
      SUCCESS: '2',
      CLIENTERROR: '4',
      SERVERERROR: '5',
    };

    if (type === ResponseCode.CLIENTERROR) {
      metrics.warning += seen;
    } else if (type === ResponseCode.SERVERERROR) {
      metrics.danger += seen;
    } else {
      metrics.normal += seen;
    }
  }
}

export default LiveTrafficData;

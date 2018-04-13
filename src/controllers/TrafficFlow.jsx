'use strict';

import Utils from './Utils';

class TrafficFlow {
  constructor() {
    this.utils = new Utils();
  }


  buildTrafficDataObject(body) {
    const trafficData = {};

    const nodes = [];
    const connections = [];

    for (let i = 0; i < body.data.result.length; i += 1) {
      const currentItem = body.data.result[i];
      const currentMetric = currentItem.metric;
      const currentValues = currentItem.values;

      const names = this.utils.getServiceNames(currentMetric);

      const responseCode = currentMetric.response_code;

      // Calculate number of requests seen in the latest time period
      const oldViewCount = parseInt(currentValues[0][1], 10);
      const newViewCount = parseInt(currentValues[1][1], 10);
      const trafficSeen = newViewCount - oldViewCount;

      // Seems to only create nodes in the graph for destination services
      // So unless the source appears as a destination service somewhere else it won't render
      // Source names given by Prometheus is the name of the deployment and not the service
      const node = this.getNode(names.dst, nodes);

      if (names.src !== 'unknown unknown') {
        const connection = this.getConnection(names.src, names.dst, connections);

        this.utils.updateConnectionMetrics(connection.metrics, responseCode, trafficSeen);
        connection.source = names.src;
        connection.target = names.dst;

        connections.push(connection);
      }

      node.renderer = 'region';
      node.layout = 'ltrTree';
      node.name = names.dst;
      node.maxVolume = 10000;
      nodes.push(node);
    }

    // Create node representing ingress
    const ingressNode = { name: 'Ingress' };
    nodes.push(ingressNode);

    // Add ingress and other mandatory details
    trafficData.renderer = 'region';
    trafficData.name = 'edge';
    trafficData.maxVolume = 10;
    trafficData.entryNode = 'Ingress';
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
}

export default TrafficFlow;

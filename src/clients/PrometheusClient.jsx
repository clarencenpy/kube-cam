'use strict';

const request = require('request');

class PrometheusClient {
  constructor() {
    this.options = {
      url: 'http://localhost:9090/api/v1/query_range',
      qs: {
        query: 'istio_request_count',
        start: undefined,
        end: undefined,
        step: undefined,
      },
    };
  }

  getTrafficData(startTime, endTime, step, setState) {
    this.options.qs.start = startTime;
    this.options.qs.end = endTime;
    this.options.qs.step = step;

    request(this.options, (err, resp, body) => {
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
          connection.metrics = { normal: 5000, danger: 5, warning: 0 };
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
    });
  }
}

export default PrometheusClient;

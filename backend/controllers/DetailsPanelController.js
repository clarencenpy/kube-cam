const Utils = require('./Utils');

class DetailsPanelController {
  constructor() {
    this.utils = new Utils();
  }


  buildDetailsPanelObject(body) {
    const detailsData = {};

    const details = [];

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

      const node = this.getDetailsNode(names.dst, details);
      node.name = names.dst;

      node.metrics.total += trafficSeen;
      this.utils.updateConnectionMetrics(node.metrics, responseCode, trafficSeen);

      const incomingNodeDetails = this.getDetailsIncomingNode(names.src, node.incoming);
      incomingNodeDetails.name = names.src;
      this.updateIncomingNode(responseCode, trafficSeen, incomingNodeDetails);
      node.incoming.push(incomingNodeDetails);

      details.push(node);
    }

    // Hardcode ingress node
    const ingressNodeDetails = { name: 'Ingress' };
    ingressNodeDetails.incoming = [];
    ingressNodeDetails.metrics = {};
    ingressNodeDetails.metrics.normal = 0;
    ingressNodeDetails.metrics.warning = 0;
    ingressNodeDetails.metrics.danger = 0;
    ingressNodeDetails.metrics.total = 0;
    details.push(ingressNodeDetails);

    detailsData.details = details;
    return detailsData;
  }


  updateIncomingNode(code, seen, details) {
    const type = code.charAt(0);

    const ResponseCode = {
      SUCCESS: '2',
      CLIENTERROR: '4',
      SERVERERROR: '5',
    };

    if (type !== ResponseCode.SUCCESS) {
      details.errors += seen;
    }
    details.total += seen;
  }


  getDetailsIncomingNode(serviceName, services) {
    for (let i = 0; i < services.length; i += 1) {
      if (services[i].name === serviceName) {
        const node = services[i];
        services.splice(i, 1);
        return node;
      }
    }
    return { name: '', errors: 0, total: 0 };
  }


  getDetailsNode(serviceName, services) {
    for (let i = 0; i < services.length; i += 1) {
      if (services[i].name === serviceName) {
        const node = services[i];
        services.splice(i, 1);
        return node;
      }
    }
    const metrics = {};
    metrics.normal = 0;
    metrics.warning = 0;
    metrics.danger = 0;
    metrics.total = 0;
    return { name: '', incoming: [], metrics: metrics };
  }
}

module.exports = DetailsPanelController;

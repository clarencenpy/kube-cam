const config = require('config');
const request = require('request');

class PrometheusClient {
  constructor() {
    this.options = {
      url: `${config.get('prometheus')}/api/v1/query_range`,
      qs: {
        query: 'istio_request_count',
        start: undefined,
        end: undefined,
        step: undefined,
      },
    };
  }


  getTrafficData(startTime, endTime, step, callback) {
    this.options.qs.start = startTime;
    this.options.qs.end = endTime;
    this.options.qs.step = step;

    request(this.options, callback);
  }
}

module.exports = PrometheusClient;

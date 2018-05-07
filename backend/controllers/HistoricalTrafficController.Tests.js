/* eslint-env mocha */

const HistoricalTrafficController = require('./HistoricalTrafficController');
const assert = require('chai').assert;
const moment = require('moment');
const nock = require('nock');
const promResponse = require('../resources/PrometheusResponse');

describe('HistoricalTrafficController', () => {
  before(() => {
    histTraffic = new HistoricalTrafficController();

    nock('http://localhost:9090')
      .get(/api\/v1\/query_range.*$/)
      .reply(200, promResponse);
  });


  describe('#getTrafficByTimePeriod()', () => {
    it('should return details, graph objects and time window', () => {
      histTraffic.getTrafficDataByTimePeriod(moment(), moment(), function(response) {
        assert.hasAllKeys(response, ['currentTimeShown', 'details', 'endTime', 'trafficData', 'startTime']);
      });
    });
  });
});

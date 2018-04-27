/* eslint-env mocha */

const LiveTrafficController = require('./LiveTrafficController');
const assert = require('chai').assert;
const nock = require('nock');
const promResponse = require('../resources/PrometheusResponse');

describe('LiveTraffic', () => {
  before(() => {
    liveTraffic = new LiveTrafficController();

    nock('http://localhost:9090')
      .get(/api\/v1\/query_range.*$/)
      .reply(200, promResponse);
  });


  describe('#getCurrentTraffic()', () => {
    it('should return details and graph objects', () => {
      liveTraffic.getCurrentTraffic(function(response) {
        assert.hasAllKeys(response, ['details', 'trafficData']);
      });
    });
  });
});

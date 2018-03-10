/* eslint-env mocha */

'use strict';

import LiveTrafficData from './LiveTrafficData';

const assert = require('assert');

describe('LiveTrafficData', () => {
  let liveTrafficData;
  let oneConnection;


  before(() => {
    liveTrafficData = new LiveTrafficData();

    // Build sample object
    const conn1 = {};
    conn1.metric = { destination_service: 'svc1', source_service: 'svc2', response_code: '200' };
    conn1.values = [[0, '0'], [0, '5']];
    const result = [conn1];
    oneConnection = { data: { result: result } };
  });


  describe('#buildTrafficDataObject()', () => {
    it('should return graph with 2 vertices and 1 edge with 5 traffic', () => {
      const trafficDataObj = liveTrafficData.buildTrafficDataObject(oneConnection);
      assert.equal(trafficDataObj.nodes.length, 2);
      assert.equal(trafficDataObj.connections.length, 1);
      assert.equal(trafficDataObj.connections[0].metrics.normal, 5);
    });
  });
});

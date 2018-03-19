/* eslint-env mocha */

'use strict';

import DetailsPanel from './DetailsPanel';

const assert = require('assert');

describe('DetailsPanelCreation', () => {
  let detailsPanel;
  let graph1;
  const srcSvc = 'svc2';
  const dstSvc = 'svc1';
  const v1 = 'v1';
  const ingressSvc = 'Ingress';


  before(() => {
    detailsPanel = new DetailsPanel();

    // Build sample object
    const conn1 = {};
    conn1.metric = {
      destination_service: dstSvc, source_service: srcSvc, response_code: '200', source_version: v1, destination_version: v1,
    };
    conn1.values = [[0, '0'], [0, '5']];

    const result1 = [conn1];
    graph1 = { data: { result: result1 } };
  });


  describe('#buildDetailsPanelObject()', () => {
    it('should return panel with 5 green 0 yellow 0 red', () => {
      const panelObj = detailsPanel.buildDetailsPanelObject(graph1);
      assert.equal(panelObj.details[0].metrics.normal, 5);
      assert.equal(panelObj.details[0].metrics.total, 5);
      assert.equal(panelObj.details[0].metrics.warning, 0);
      assert.equal(panelObj.details[0].metrics.danger, 0);
    });
  });


  describe('#buildDetailsPanelObject()', () => {
    it('should return panel with 1 incoming node and ingress node', () => {
      const panelObj = detailsPanel.buildDetailsPanelObject(graph1);
      assert.equal(panelObj.details.length, 2);
      assert.equal(panelObj.details[0].incoming.length, 1);
      assert.equal(panelObj.details[0].incoming[0].name, `${srcSvc} ${v1}`);
      assert.equal(panelObj.details[1].incoming.length, 0);
      assert.equal(panelObj.details[1].name, ingressSvc);
    });
  });
});

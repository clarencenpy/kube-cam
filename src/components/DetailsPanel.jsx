'use strict';

import React from 'react';
import { Glyphicon, Panel, Table } from 'react-bootstrap';
import './DetailsPanel.css';

class DetailsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      details: props.details.details,
    };
  }


  render() {
    let index = 0;
    for (let i = 0; i < this.state.details.length; i += 1) {
      if (this.state.details[i].name === this.props.highlightedNode) {
        index = i;
        break;
      }
    }

    const incoming = this.state.details[index].incoming.map(node => (
      <tr key={node.name}>
        <td>{node.name}</td>
        <td>{node.errors}</td>
        <td>{node.total}</td>
      </tr>
    ));

    const normalStyle = {
      color: '#BAD5ED',
    };

    const warningStyle = {
      color: '#FFB949',
    };

    const dangerStyle = {
      color: '#FF3535',
    };

    return (
      <Panel>
        <Panel.Heading>
          <h5>
            {this.state.details[index].name}
            <Glyphicon onClick={this.props.objectHighlighted} glyph="remove" id="panel-close" />
          </h5>
        </Panel.Heading>
        <Panel.Body>
          <h4>Traffic Summary</h4>
          <Table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Glyphicon glyph="chevron-right" style={normalStyle} />&nbsp;200s
                </td>
                <td>{this.state.details[index].metrics.normal}</td>
              </tr>
              <tr>
                <td>
                  <Glyphicon glyph="chevron-right" style={warningStyle} />&nbsp;400s
                </td>
                <td>{this.state.details[index].metrics.warning}</td>
              </tr>
              <tr>
                <td>
                  <Glyphicon glyph="chevron-right" style={dangerStyle} />&nbsp;500s
                </td>
                <td>{this.state.details[index].metrics.danger}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>{this.state.details[index].metrics.total}</td>
              </tr>
            </tbody>
          </Table>
          <br />
          <h4>Incoming Traffic</h4>
          <Table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Errors</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {incoming}
            </tbody>
          </Table>
        </Panel.Body>
      </Panel>
    );
  }
}


DetailsPanel.propTypes = {
  details: React.PropTypes.object.isRequired,
  highlightedNode: React.PropTypes.string.isRequired,
  objectHighlighted: React.PropTypes.func.isRequired,
};

export default DetailsPanel;

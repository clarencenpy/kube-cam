'use strict';

import React from 'react';
import { Alert, Button, FormGroup, FormControl, Glyphicon, Nav, NavItem, Panel, Table } from 'react-bootstrap';
import yamljs from 'yamljs';
import './DetailsPanel.css';


class DetailsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      details: props.details.details,
      activeKey: 'traffic',
      routeRulesStyle: { display: 'none' },
      trafficStyle: { display: 'block' },
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmitRouteRules = this.handleSubmitRouteRules.bind(this);
    this.updateRule = this.updateRule.bind(this);
  }


  componentDidMount() {
    const { namespace, service } = this.parseHighlighedNodeName();
    fetch(`kubecam/routerules/namespaces/${namespace}/service/${service}`)
      .then(results => results.json())
      .then((response) => {
        const rules = response.items;
        rules.map(rule => delete rule.metadata.resourceVersion);
        const rulesYaml = yamljs.stringify(rules, 6);
        this.setState({ routeRules: rulesYaml });
      })
      .catch(error => console.error(error));
  }


  parseHighlighedNodeName() {
    const names = this.props.highlightedNode.split(/\s|\./);
    return { namespace: names[1], service: names[0] };
  }


  handleSelect(key, event) {
    event.preventDefault();
    if (key === 'traffic') {
      this.setState({ activeKey: 'traffic', routeRulesStyle: { display: 'none' }, trafficStyle: { display: 'block' } });
    } else {
      this.setState({ activeKey: 'routerules', routeRulesStyle: { display: 'block' }, trafficStyle: { display: 'none' } });
    }
  }


  handleSubmitRouteRules(event) {
    event.preventDefault();
    const jsonRules = yamljs.parse(this.state.routeRules);
    if (typeof jsonRules !== 'object') {
      this.setState({ updateError: 'Invalid route rule' });
    }
    jsonRules.map((rule) => {
      const { namespace } = rule.metadata;
      const { name } = rule.metadata;
      return fetch(`kubecam/routerules/namespaces/${namespace}/rule/${name}`, {
        body: JSON.stringify(rule),
        headers: {
          'content-type': 'application/json',
        },
        method: 'PUT',
      })
        .then((response) => {
          this.setState({ respStatus: response.status });
          return response.json();
        })
        .then((resp) => {
          const respStr = JSON.stringify(resp);
          if (this.state.respStatus !== 201) {
            this.setState({ updateError: respStr, updateSuccess: undefined });
          } else {
            console.log('ughhh');
            this.setState({ updateSuccess: respStr, updateError: undefined });
          }
        });
    });
  }


  updateRule(event) {
    this.setState({ routeRules: event.target.value });
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

    const routerules = (
      <form onSubmit={this.handleSubmitRouteRules}>
        <FormGroup controlId='routerules'>
          <FormControl componentClass='textarea' value={this.state.routeRules} onChange={this.updateRule} />
        </FormGroup>
        <Button type='submit' bsStyle='primary'>Submit</Button>
      </form>
    );

    return (
      <Panel>
        <Panel.Heading>
          <h5>
            {this.state.details[index].name}
            <Glyphicon onClick={this.props.objectHighlighted} glyph='remove' id='panel-close' />
          </h5>
        </Panel.Heading>
        <Panel.Body>
          <Nav bsStyle='tabs' activeKey={this.state.activeKey} onSelect={this.handleSelect}>
            <NavItem eventKey='traffic'>Traffic Summary</NavItem>
            <NavItem eventKey='routerules'>Route Rules</NavItem>
          </Nav>
          <div style={this.state.trafficStyle}>
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
                    <Glyphicon glyph='chevron-right' style={normalStyle} />&nbsp;200s
                  </td>
                  <td>{this.state.details[index].metrics.normal}</td>
                </tr>
                <tr>
                  <td>
                    <Glyphicon glyph='chevron-right' style={warningStyle} />&nbsp;400s
                  </td>
                  <td>{this.state.details[index].metrics.warning}</td>
                </tr>
                <tr>
                  <td>
                    <Glyphicon glyph='chevron-right' style={dangerStyle} />&nbsp;500s
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
          </div>
          <div style={this.state.routeRulesStyle}>
            {this.state.updateError &&
              <div>
                <br />
                <Alert bsStyle='warning'>
                  <h5>Error updating rule</h5>
                  {this.state.updateError}
                </Alert>
              </div>
            }
            {this.state.updateSuccess &&
              <div>
                <br />
                <Alert bsStyle='success'>
                  <h5>Updated rule successfully</h5>
                </Alert>
              </div>
            }
            <h4>Route Rules</h4>
            {routerules}
          </div>
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

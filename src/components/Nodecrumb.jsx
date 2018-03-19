'use strict';

import React from 'react';
import { Breadcrumb, Row } from 'react-bootstrap';
import './Nodecrumb.css';

class Nodecrumb extends React.Component {
  render() {
    return (
      <Row>
        {this.props.path.length === 0 &&
          <Breadcrumb>
            <Breadcrumb.Item active onClick={this.props.navigateHome}>Overview</Breadcrumb.Item>
          </Breadcrumb>
        }
        {this.props.path.length !== 0 &&
          <Breadcrumb>
            <Breadcrumb.Item onClick={this.props.navigateHome}>Overview</Breadcrumb.Item>
            <Breadcrumb.Item active>{this.props.path[0]}</Breadcrumb.Item>
          </Breadcrumb>
        }
      </Row>
    );
  }
}

Nodecrumb.propTypes = {
  path: React.PropTypes.array.isRequired,
  navigateHome: React.PropTypes.func.isRequired,
};

export default Nodecrumb;

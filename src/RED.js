import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Project extends Component {

  static propTypes = {
    red: PropTypes.object,
  };

  static defaultProps = {
    red: null,
  };

  render() {
      const { red } = this.props;

      if (red === null) {
        return <p className="alert">No RED file found.</p>;
      }

      const { inputs, outputs, baseCommand, doc } = red.cli;

      const li = (value, key) => (
        <li key={key}>
          <strong>{key}</strong>
          {' '}
          <span className="tag tag-info">{value.type}</span>
          {' '}
          <small>{value.doc}</small>
        </li>
      );

      return (
        <React.Fragment>
          <h3> Command <code>{baseCommand}</code> <small>{doc}</small></h3>
          <div className="grid grid-middle" style={{ clear: 'both' }}>
            <div className="cell">
              <ul className="list-group list-striped">
                {_.map(inputs, li)}
              </ul>
            </div>
            <span style={{ padding: '1rem 0 0 1rem', fontSize: '4rem' }}>→</span>
            <div className="cell">
              <ul className="list-group list-striped">
                {_.map(outputs, li)}
              </ul>
            </div>
          </div>
        </React.Fragment>
      );
    }

}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import axios from 'axios';
import yaml from 'js-yaml';

const FILENAME = 'red.yml';

export default class Project extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  state = {
    red: undefined,
  }

  componentDidMount() {
    const { data } = this.props;
    const url = `https://api.github.com/repos/${data.full_name}/contents/${FILENAME}`;
    const headers = {
      Accept: 'application/vnd.github.mercy-preview+json',
    };

    axios.get(url, { headers })
      .then((response) => {
        const content = atob(response.data.content);
        const json = yaml.safeLoad(content);
        this.setState({ red: json });
      })
      .catch((/* error */) => {
        this.setState({ red: null });
      });
  }

  renderRed() {
    const { red } = this.state;

    if (red === undefined) {
      return <h2 className="loading">Loading RED data</h2>;
    }

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
        <div>
          <strong>{baseCommand}</strong>: {doc}
        </div>
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

  render() {
    const { data } = this.props;

    return (
      <article key={data.id}>
        <h2>
          <a href={data.html_url}>{data.full_name}</a> <small>{data.description}</small>
        </h2>

        <div style={{ float: 'right' }}>
          {data.homepage &&
            <span>Homepage: <a href={data.homepage}>{data.homepage}</a></span>
          }
          {data.license && data.license.spdx_id &&
            <span>License: <a href={data.license.url}>{data.license.spdx_id}</a></span>
          }
        </div>

        {this.renderRed()}
      </article>
    );
  }

}

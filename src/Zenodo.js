import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import axios from 'axios';

export default class Zenodo extends Component {

  static propTypes = {
    project: PropTypes.string.isRequired,
  }

  state = {
    records: null,
  }

  componentDidMount() {
    this.load();
  }

  load = () => {
    const { project } = this.props;
    const searchTerm = encodeURIComponent(project.replace(/\//g, ' '));
    const url = `https://zenodo.org/api/records/?q=${searchTerm}`;

    return axios.get(url)
      .then((response) => {
          const records = response.data
            .filter((record) => {
              const ids = _.get(record, 'metadata.related_identifiers', []);
              return ids.some(id => _.get(id, 'identifier', '').includes(project));
            });
          this.setState({ records });
        })
      .catch((/* error */) => {});
  }

  render() {
    const { records } = this.state;

    if (records === null || !records.length) {
      return null; // <p className="alert">No DOIs found.</p>;
    }

    const date = d => new Date(d).toLocaleDateString();
    const link = record => <span><a href={record.links.doi}>{record.doi}</a> <small>created at {date(record.created)}</small></span>;

    if (records.length === 1) {
      return <h3>DOI: {link(_.first(records))}</h3>;
    }

    return (
      <React.Fragment>
        <h3>DOIs</h3>
        <ul>
          {records.map(record =>
            <li>{link(record)}</li>
          )}
        </ul>
      </React.Fragment>
    );
  }

}

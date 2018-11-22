import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import axios from 'axios';
import yaml from 'js-yaml';
import RED from './RED';
import Bibtex from './Bibtex';
import Zenodo from './Zenodo';

const TOKEN = process.env.REACT_APP_PORT;

const FILES = {
  'red.yml': 'loadRedFile',
  'references.bib': 'loadBibFile',
  'filesystem.json': 'loadVmFile',
};

export default class Project extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  state = {
    red: null,
    bibtex: null,
    files: null,
  }

  componentDidMount() {
    this.loadFiles();
  }

  loadFiles = () => {
    this.loadFile()
      .then((response) => {
        _.each(response.data, (file) => {
          if (FILES[file.name] && file.size > 0) {
            this[FILES[file.name]](this.loadFile(file.name));
          }
        });
        this.setState({ files: response.data });
      });
  }

  loadRedFile = (promise) => {
    promise.then((response) => {
      const content = atob(response.data.content);
      const json = yaml.safeLoad(content);
      this.setState({ red: json });
    });
  }

  loadBibFile = (promise) => {
    promise.then((response) => {
      const bibtex = atob(response.data.content);
      this.setState({ bibtex });
    });
  }

  loadVmFile = (promise) => {
    promise.then((response) => {
      // debugger;
      // this.setState({ vm: json });
    });
  }

  loadFile = (filename = '') => {
    const url = `https://api.github.com/repos/${this.props.data.full_name}/contents/${filename}`;
    const headers = {
      Accept: 'application/vnd.github.mercy-preview+json',
      Authorization: TOKEN && `token ${TOKEN}`,
    };

    return axios.get(url, { headers })
      .catch((/* error */) => {});
  }

  render() {
    const { data } = this.props;
    const { red, bibtex } = this.state;

    return (
      <article key={data.id} className="dashed-top p-t-1 p-b-2">
        <h2>
          <a href={data.html_url}>{data.full_name}</a> <small>{data.description}</small>
        </h2>

        {data.doc &&
          <blockquote>{data.doc}</blockquote>
        }

        <div style={{ float: 'right' }}>
          {data.homepage &&
            <span>Homepage: <a href={data.homepage}>{data.homepage}</a></span>
          }
          {data.license && data.license.spdx_id &&
            <span>License: <a href={data.license.url}>{data.license.spdx_id}</a></span>
          }
        </div>

        <Zenodo project={data.full_name} />

        <RED red={red} />

        <Bibtex bibtex={bibtex} />
      </article>
    );
  }

}

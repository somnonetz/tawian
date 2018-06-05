import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Bibliography from 'react-bibliography';

export default class Bibtex extends Component {

  static propTypes = {
    bibtex: PropTypes.string,
  };

  static defaultProps = {
    bibtex: undefined,
  };

  render() {
    const { bibtex } = this.props;

    if (bibtex === null) {
      return null; // <p className="alert">No Bibtext file found.</p>;
    }

    return (
      <React.Fragment>
        <h3>References</h3>
        <Bibliography bibtex={bibtex} />
      </React.Fragment>
    );
  }

}

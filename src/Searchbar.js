import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Searchbar extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
  }

  onChange = (ev) => {
    ev.preventDefault();
    this.props.onChange(this.input.value);
  }

  render() {
    return (
      <form className="cell" onSubmit={this.onChange}>
        <input
          ref={e => this.input = e}
          type="search"
          placeholder="Search"
          className="full-width"
        />
      </form>
    );
  }

}

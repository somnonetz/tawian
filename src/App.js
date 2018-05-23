import React, { Component } from 'react';
import axios from 'axios';
import Project from './Project';

const searchTopic = 'tawian';

export default class App extends Component {

  state = {
    count: 0,
    projects: null,
  }

  componentDidMount() {
    const url = `https://api.github.com/search/repositories?q=topic:${searchTopic}`;
    const headers = {
      Accept: 'application/vnd.github.mercy-preview+json',
    };

    axios.get(url, { headers })
      .then(({ data }) => {
        this.setState({
          count: data.total_count,
          projects: data.items,
        });
      })
      .catch((error) => {
        if (error.response.status === 404) return;
        console.error(error);
      });
  }

  render() {
    const { count, projects } = this.state;

    if (!projects) {
      return <h1 className="loading">Loading Projects</h1>;
    }

    if (!projects.length) {
      return <p className="alert">No projects found.</p>;
    }

    return (
      <React.Fragment>
        <p>Showing {count} of {projects.length} projects.</p>
        {projects.map(project => (
          <Project data={project} />
        ))}
      </React.Fragment>
    );
  }

}

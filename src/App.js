import React, { Component } from 'react';
import axios from 'axios';
import Project from './Project';
import Searchbar from './Searchbar';

const searchTopic = 'tawian';

export default class App extends Component {

  state = {
    count: 0,
    projects: null,
  }

  componentDidMount() {
    this.load();
  }

  onSearchChange = (searchTerm) => {
    this.load(searchTerm);
  }

  load = (searchTerm = '') => {
    const url = `https://api.github.com/search/repositories?q=${searchTerm} topic:${searchTopic}`;
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

    return (
      <React.Fragment>
        <div className="grid-inline p-b-1">
          <p>Showing {count} of {projects.length} projects.</p>
          <Searchbar onChange={this.onSearchChange} />
        </div>

        {projects.length
          ? projects.map(project => <Project key={project.id} data={project} />)
          : <p className="alert">No projects found.</p>
        }
      </React.Fragment>
    );
  }

}

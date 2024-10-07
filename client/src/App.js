import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component {
  state = {
    data: [], // Movies data
    loading: true, // Loading state
    error: null, // Error state
    sortConfig: { key: 'title', direction: 'ascending' }, // Sorting state
  };

  componentDidMount() {
    // Fetch movies from the API
    axios.get('http://localhost:5000/api/movies')
      .then((response) => {
        this.setState({
          data: response.data,
          loading: false // Set loading to false when data is fetched
        });
      })
      .catch((error) => {
        console.error(`Error fetching movies: ${error}`);
        this.setState({ error: error.message, loading: false });
      });
  }

  // Sort handler function
  handleSort = (key) => {
    const { sortConfig, data } = this.state;
    let direction = 'ascending';

    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    this.setState({
      data: sortedData,
      sortConfig: { key, direction }
    });
  };

  render() {
    const { data, loading, error, sortConfig } = this.state;

    // Show a loading message while data is being fetched
    if (loading) {
      return <div className='App'>Loading movies...</div>;
    }

    // Show an error message if the API call fails
    if (error) {
      return <div className='App'>Error fetching movies: {error}</div>;
    }

    const getArrowClass = (key) => {
      if (sortConfig.key === key) {
        return sortConfig.direction === 'ascending' ? 'sorted-asc' : 'sorted-desc';
      }
      return '';
    };

    return (
      <div className='App'>
        <header className='App-header'>
          Movie Watchlist
        </header>
        <table className="movie-table">
          <thead>
            <tr>
              <th onClick={() => this.handleSort('title')} className={getArrowClass('title')}>
                Title
              </th>
              <th onClick={() => this.handleSort('director')} className={getArrowClass('director')}>
                Director
              </th>
              <th onClick={() => this.handleSort('releaseYear')} className={getArrowClass('releaseYear')}>
                Release Year
              </th>
              <th onClick={() => this.handleSort('genre')} className={getArrowClass('genre')}>
                Genre
              </th>
              <th onClick={() => this.handleSort('rating')} className={getArrowClass('rating')}>
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((movie) => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>
                  <td>{movie.director}</td>
                  <td>{movie.releaseYear}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.rating}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No movies found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;

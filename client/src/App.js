import React from 'react';
import './App.css';
import axios from 'axios';
import AddRecipe from './AddRecipe';

class App extends React.Component {
  state = {
    data: [],
    loading: true,
    error: null,
    sortConfig: { key: 'name', direction: 'ascending' }, 
    editingRecipe: null, 
  };

  componentDidMount() {
    this.fetchRecipes();
  }

  fetchRecipes = () => {
    axios
      .get('http://localhost:5000/api/recipes')
      .then((response) => {
        this.setState({
          data: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        console.error(`Error fetching recipes: ${error}`);
        this.setState({ error: error.message, loading: false });
      });
  };

  handleRecipeAdded = (newRecipe) => {
    this.setState((prevState) => ({
      data: [...prevState.data, newRecipe],
    }));
  };

  handleRecipeUpdated = (updatedRecipe) => {
    this.setState((prevState) => ({
      data: prevState.data.map((recipe) =>
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      ),
      editingRecipe: null, 
    }));
  };

  handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${id}`);
      this.setState((prevState) => ({
        data: prevState.data.filter((recipe) => recipe._id !== id),
      }));
    } catch (err) {
      console.error('Error deleting recipe:', err);
    }
  };

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
      sortConfig: { key, direction },
    });
  };

  render() {
    const { data, loading, error, sortConfig, editingRecipe } = this.state;

    if (loading) {
      return <div className="App">Loading recipes...</div>;
    }

    if (error) {
      return <div className="App">Error fetching recipes: {error}</div>;
    }

    const getArrowClass = (key) => {
      if (sortConfig.key === key) {
        return sortConfig.direction === 'ascending' ? 'sorted-asc' : 'sorted-desc';
      }
      return '';
    };

    return (
      <div className="App">
        <header className="App-header">Recipe Vault</header>

        {}
        <AddRecipe
          onRecipeAdded={this.handleRecipeAdded}
          editingRecipe={editingRecipe}
          onRecipeUpdated={this.handleRecipeUpdated}
        />

        {}
        <table className="recipe-table">
          <thead>
            <tr>
              <th onClick={() => this.handleSort('name')} className={getArrowClass('name')}>
                Name
              </th>
              <th onClick={() => this.handleSort('cuisine')} className={getArrowClass('cuisine')}>
                Cuisine
              </th>
              <th onClick={() => this.handleSort('preparationTime')} className={getArrowClass('preparationTime')}>
                Preparation Time
              </th>
              <th>Ingredients</th>
              <th>Instructions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((recipe) => (
                <tr key={recipe._id}>
                  <td>{recipe.name}</td>
                  <td>{recipe.cuisine}</td>
                  <td>{recipe.preparationTime} min</td>
                  <td>{recipe.ingredients.join(', ')}</td>
                  <td>{recipe.instructions}</td>
                  <td>
                    <button
                      style={{
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '5px',
                      }}
                      onClick={() => this.handleDelete(recipe._id)}
                    >
                      Delete
                    </button>
                    <button
                      style={{
                        backgroundColor: 'yellow',
                        color: 'black',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={() => this.setState({ editingRecipe: recipe })}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No recipes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;

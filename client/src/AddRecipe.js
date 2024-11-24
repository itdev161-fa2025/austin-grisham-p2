import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddRecipe = ({ onRecipeAdded, editingRecipe, onRecipeUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    preparationTime: '',
    ingredients: '',
    instructions: '',
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingRecipe) {
      setFormData({
        ...editingRecipe,
        ingredients: editingRecipe.ingredients.join(', '),
      });
    }
  }, [editingRecipe]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipeData = {
      ...formData,
      preparationTime: parseInt(formData.preparationTime, 10),
      ingredients: formData.ingredients.split(',').map((item) => item.trim()),
    };

    try {
      if (editingRecipe) {
        const response = await axios.put(
          `http://localhost:5000/api/recipes/${editingRecipe._id}`,
          recipeData
        );
        onRecipeUpdated(response.data);
      } else {
        const response = await axios.post('http://localhost:5000/api/recipes', recipeData);
        onRecipeAdded(response.data);
      }
      setFormData({
        name: '',
        cuisine: '',
        preparationTime: '',
        ingredients: '',
        instructions: '',
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while saving the recipe.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{editingRecipe ? 'Edit Recipe' : 'Add a New Recipe'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Recipe Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="cuisine"
          placeholder="Cuisine"
          value={formData.cuisine}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="preparationTime"
          placeholder="Prep Time (min)"
          value={formData.preparationTime}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="ingredients"
          placeholder="Ingredients (comma-separated)"
          value={formData.ingredients}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="instructions"
          placeholder="Instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>
          {editingRecipe ? 'Update Recipe' : 'Add Recipe'}
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    margin: '10px auto',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    maxWidth: '80%',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '1rem',
    margin: '1px 0',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  input: {
    padding: '4px 6px',
    fontSize: '0.85rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  textarea: {
    padding: '4px 6px',
    fontSize: '0.85rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    height: '50px',
    resize: 'none',
  },
  button: {
    padding: '6px 8px',
    fontSize: '0.85rem',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'center',
    marginBottom: '1px',
  },
  error: {
    color: 'red',
    fontSize: '0.75rem',
    textAlign: 'center',
  },
};

export default AddRecipe;

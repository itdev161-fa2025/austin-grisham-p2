import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

test('renders RecipeVault header', () => {
  render(<App />);
  const headerElement = screen.getByText(/RecipeVault/i);
  expect(headerElement).toBeInTheDocument();
});

test('fetches and displays recipes', async () => {
  const mockRecipes = [
    {
      _id: '1',
      name: 'Spaghetti Bolognese',
      cuisine: 'Italian',
      preparationTime: 45,
      ingredients: ['Spaghetti', 'Ground Beef', 'Tomato Sauce'],
    },
    {
      _id: '2',
      name: 'Chicken Tacos',
      cuisine: 'Mexican',
      preparationTime: 20,
      ingredients: ['Chicken', 'Tortilla', 'Cheese', 'Lettuce'],
    },
  ];
  axios.get.mockResolvedValueOnce({ data: mockRecipes });

  render(<App />);

  await waitFor(() => {
    const firstRecipe = screen.getByText(/Spaghetti Bolognese/i);
    const secondRecipe = screen.getByText(/Chicken Tacos/i);
    expect(firstRecipe).toBeInTheDocument();
    expect(secondRecipe).toBeInTheDocument();
  });
});

test('displays loading message initially', () => {
  render(<App />);
  const loadingElement = screen.getByText(/Loading recipes.../i);
  expect(loadingElement).toBeInTheDocument();
});

test('displays error message on API failure', async () => {
  axios.get.mockRejectedValueOnce(new Error('Failed to fetch recipes'));

  render(<App />);

  await waitFor(() => {
    const errorElement = screen.getByText(/Error fetching recipes/i);
    expect(errorElement).toBeInTheDocument();
  });
});

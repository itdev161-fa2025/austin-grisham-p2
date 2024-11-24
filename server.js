import express from 'express';
import { check, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Recipe from './models/Recipe.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const mongoURI =
  'mongodb+srv://username:username@cluster0.vi92d.mongodb.net/RecipeVault?retryWrites=true&w=majority&appName=Cluster0';
mongoose
  .connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Database connection error:', err));

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); 

app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post(
  '/api/recipes',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('ingredients', 'Ingredients are required').isArray({ min: 1 }),
    check('cuisine', 'Cuisine is required').not().isEmpty(),
    check('preparationTime', 'Preparation time must be a positive number').isInt({ min: 1 }),
    check('instructions', 'Instructions are required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const { name, ingredients, cuisine, preparationTime, instructions } = req.body;
      const newRecipe = new Recipe({
        name,
        ingredients,
        cuisine,
        preparationTime,
        instructions,
      });
      await newRecipe.save();
      res.status(201).json(newRecipe);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    await Recipe.deleteOne({ _id: req.params.id }); 
    res.status(200).json({ message: 'Recipe deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put(
  '/api/recipes/:id',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('ingredients', 'Ingredients are required').isArray({ min: 1 }),
    check('cuisine', 'Cuisine is required').not().isEmpty(),
    check('preparationTime', 'Preparation time must be a positive number').isInt({ min: 1 }),
    check('instructions', 'Instructions are required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const { name, ingredients, cuisine, preparationTime, instructions } = req.body;
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        req.params.id,
        { name, ingredients, cuisine, preparationTime, instructions },
        { new: true, runValidators: true }
      );
      if (!updatedRecipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      res.status(200).json(updatedRecipe);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

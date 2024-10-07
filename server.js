import express from 'express';
import { check, validationResult } from 'express-validator';
import connectDatabase from './config/db.js';
import Movie from './models/Movie.js';  // Your Movie model
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
connectDatabase();

// Middleware to handle JSON requests and enable CORS
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));  // Adjust if needed

// Example API route to fetch all movies
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Example API route to add a new movie (adjust as needed)
app.post('/api/movies', [
    check('title', 'Title is required').not().isEmpty(),
    check('director', 'Director is required').not().isEmpty(),
    check('releaseYear', 'Please include a valid release year').isInt(),
    check('genre', 'Genre is required').not().isEmpty(),
    check('rating', 'Rating must be between 0 and 10').optional().isFloat({ min: 0, max: 10 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const { title, director, releaseYear, genre, rating } = req.body;
        const newMovie = new Movie({ title, director, releaseYear, genre, rating });
        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Serve React frontend in production mode
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    // Handle any other routes by serving the React app's index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

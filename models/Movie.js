import mongoose from 'mongoose';

// Define the Movie schema
const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    releaseYear: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10 // Optional field for user ratings with a range between 0 and 10
    },
    addedAt: {
        type: Date,
        default: Date.now // Automatically adds the current date when a movie is added
    }
});

// Create the Movie model using the schema
const Movie = mongoose.model('Movie', MovieSchema);

export default Movie;

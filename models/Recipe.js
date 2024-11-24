import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String], 
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    preparationTime: {
        type: Number, 
        required: true
    },
    instructions: {
        type: String, 
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now 
    }
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;

const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    dish: {
        type: String,
        enum: ['Pizza', 'Burger', 'Pasta', 'Momo', 'HotDog'],
        required: true,
    },
    type: {
        type: String,
        enum: ['prepared', 'consumed'],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
},
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('Dish', dishSchema);
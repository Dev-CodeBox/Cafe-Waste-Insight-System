const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
    },
    waste: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Waste', wasteSchema);
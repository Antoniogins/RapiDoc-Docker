const mongoose = require('mongoose');

const specSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    yamlContent: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
specSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Spec', specSchema); 
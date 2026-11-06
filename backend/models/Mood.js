const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: String,
        required: true
    },
    note: {
        type: String,
        default: ''
    },
    intensity: {
        type: Number,
        default: 5
    },
    activities: {
        type: [String],
        default: []
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

moodSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

const Mood = mongoose.model('Mood', moodSchema);

module.exports = Mood;

const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

musicSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

const Music = mongoose.model('Music', musicSchema);

module.exports = Music;

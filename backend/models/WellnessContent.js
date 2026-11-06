const mongoose = require('mongoose');

const wellnessSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['meditation', 'music', 'breathing', 'affirmation', 'video'],
        required: true
    },
    duration: {
        type: String,
        allowNull: true
    },
    audioUrl: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: 'general'
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

wellnessSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

const WellnessContent = mongoose.model('WellnessContent', wellnessSchema);

module.exports = WellnessContent;

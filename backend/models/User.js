const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    supportType: {
        type: String,
        enum: ['Cancer Support', 'Chronic Illness', 'Caregiver Support'],
        default: null
    },
    avatar: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    illnessType: {
        type: String,
        default: ''
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WellnessContent'
    }],
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// For compatibility with frontend that might expect .id instead of ._id
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

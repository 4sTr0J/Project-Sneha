const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    illnessType: {
        type: String,
        required: true
    },
    memberCount: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String,
        default: ''
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

communitySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;

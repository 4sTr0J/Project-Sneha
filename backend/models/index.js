const User = require('./User');
const WellnessContent = require('./WellnessContent');
const Community = require('./Community');
const Message = require('./Message');
const Music = require('./Music');
const Mood = require('./Mood');

// In Mongoose, relationships are typically defined in the schemas using 'ref'.
// Any additional cross-model logic can be added here if needed, 
// but for now, we just export the models.

module.exports = {
    User,
    WellnessContent,
    Community,
    Message,
    Music,
    Mood
};

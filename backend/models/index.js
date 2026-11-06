const User = require('./User');
const WellnessContent = require('./WellnessContent');
const Community = require('./Community');
const Message = require('./Message');
const Music = require('./Music');
const Mood = require('./Mood');

// User <-> WellnessContent (Favorites) Many-to-Many
User.belongsToMany(WellnessContent, { through: 'UserFavorites', as: 'Favorites' });
WellnessContent.belongsToMany(User, { through: 'UserFavorites' });

// User <-> Community (Members) Many-to-Many
User.belongsToMany(Community, { through: 'CommunityMembers', as: 'groups' });
Community.belongsToMany(User, { through: 'CommunityMembers', as: 'members' });

// Message -> User (Sender/Receiver)
Message.belongsTo(User, { as: 'senderUser', foreignKey: 'sender' });
Message.belongsTo(User, { as: 'receiverUser', foreignKey: 'receiver' });

// User <-> Mood (History) One-to-Many
User.hasMany(Mood, { foreignKey: 'userId', as: 'moods' });
Mood.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    User,
    WellnessContent,
    Community,
    Message,
    Music,
    Mood
};

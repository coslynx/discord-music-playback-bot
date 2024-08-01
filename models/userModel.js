const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    discriminator: {
        type: String,
        required: true,
    },
    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    versionKey: false // Disables the created __v property in documents
});

// Static method to find a user by userId
userSchema.statics.findByUserId = async function(userId) {
    try {
        return await this.findOne({ userId });
    } catch (error) {
        throw new Error(`Error finding user by userId: ${error.message}`);
    }
};

// Static method to create or update a user
userSchema.statics.createOrUpdateUser = async function(userData) {
    const { userId, username, discriminator } = userData;
    try {
        return await this.findOneAndUpdate(
            { userId },
            { username, discriminator },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
    } catch (error) {
        throw new Error(`Error creating/updating user: ${error.message}`);
    }
};

// Instance method to add a playlist reference
userSchema.methods.addPlaylist = async function(playlistId) {
    if (!this.playlists.includes(playlistId)) {
        this.playlists.push(playlistId);
        await this.save();
        return true;
    }
    return false;
};

// Instance method to remove a playlist reference
userSchema.methods.removePlaylist = async function(playlistId) {
    const index = this.playlists.indexOf(playlistId);
    if (index > -1) {
        this.playlists.splice(index, 1);
        await this.save();
        return true;
    }
    return false;
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
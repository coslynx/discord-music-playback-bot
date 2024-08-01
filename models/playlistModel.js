const mongoose = require('mongoose');
const { Schema } = mongoose;

const playlistSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    songs: [{
        type: String,
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false // Disables the created __v property in documents
});

// Static method to find a playlist by name for a user
playlistSchema.statics.findByName = async function(userId, name) {
    try {
        return await this.findOne({ userId, name });
    } catch (error) {
        throw new Error(`Error finding playlist by name: ${error.message}`);
    }
};

// Static method to get all playlists for a user
playlistSchema.statics.getUserPlaylists = async function(userId) {
    try {
        return await this.find({ userId });
    } catch (error) {
        throw new Error(`Error fetching playlists for user ${userId}: ${error.message}`);
    }
};

// Instance method to add a song to the playlist
playlistSchema.methods.addSong = async function(songUrl) {
    if (!this.songs.includes(songUrl)) {
        this.songs.push(songUrl);
        await this.save();
        return true;
    }
    return false;
};

// Instance method to remove a song from the playlist
playlistSchema.methods.removeSong = async function(songUrl) {
    const index = this.songs.indexOf(songUrl);
    if (index > -1) {
        this.songs.splice(index, 1);
        await this.save();
        return true;
    }
    return false;
};

// Instance method to clear the playlist
playlistSchema.methods.clearPlaylist = async function() {
    this.songs = [];
    await this.save();
};

// Export the Playlist model
module.exports = mongoose.model('Playlist', playlistSchema);
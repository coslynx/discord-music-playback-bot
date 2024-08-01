const mongoose = require('mongoose');
const { Schema } = mongoose;

const songSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    platform: {
        type: String,
        enum: ['YouTube', 'Spotify', 'SoundCloud'],
        required: true
    },
    duration: {
        type: Number,
        required: true  // Duration in seconds
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false // Disables the created __v property in documents
});

// Static method to find a song by URL
songSchema.statics.findByUrl = async function(url) {
    try {
        return await this.findOne({ url });
    } catch (error) {
        throw new Error(`Error finding song by URL: ${error.message}`);
    }
};

// Instance method to update song duration
songSchema.methods.updateDuration = async function(newDuration) {
    try {
        this.duration = newDuration;
        await this.save();
        return this;
    } catch (error) {
        throw new Error(`Error updating duration: ${error.message}`);
    }
};

// Export the model
module.exports = mongoose.model('Song', songSchema);
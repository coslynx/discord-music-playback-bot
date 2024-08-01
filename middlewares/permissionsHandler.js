const { Permissions } = require('discord.js');
const logger = require('../utils/logger');

const userPermissions = new Map(); // Store user permissions in a Map for quick access

// Middleware to set user permissions
async function setUserPermissions(userId, permissionValue) {
    try {
        if (!userPermissions.has(userId)) {
            userPermissions.set(userId, new Set());
        }
        // Update permissions based on the value provided
        if (permissionValue === 'admin') {
            userPermissions.get(userId).add(Permissions.FLAGS.ADMINISTRATOR);
        } else if (permissionValue === 'user') {
            userPermissions.get(userId).delete(Permissions.FLAGS.ADMINISTRATOR);
        } else {
            throw new Error('Invalid permission value');
        }
        logger.info(`Permissions for user ${userId} set to ${permissionValue}.`);
        return true;
    } catch (error) {
        logger.error(`Error setting permissions for user ${userId}: ${error.message}`);
        throw new Error('Failed to set user permissions.');
    }
}

// Middleware to get user permissions
async function getUserPermissions(userId) {
    try {
        if (!userPermissions.has(userId)) {
            return null; // User has no permissions set
        }
        const permissions = Array.from(userPermissions.get(userId));
        logger.info(`Retrieved permissions for user ${userId}: ${permissions}`);
        return permissions;
    } catch (error) {
        logger.error(`Error retrieving permissions for user ${userId}: ${error.message}`);
        throw new Error('Failed to retrieve user permissions.');
    }
}

// Middleware to check if the user has the required permissions for a specific command
async function checkPermissions(interaction, requiredPermissions) {
    const userId = interaction.user.id;
    const userPerms = await getUserPermissions(userId);
    
    if (!userPerms || !userPerms.includes(requiredPermissions)) {
        return interaction.reply({ content: 'You do not have permission to perform this action.', ephemeral: true });
    }
    return true; // User has the required permissions
}

module.exports = {
    setUserPermissions,
    getUserPermissions,
    checkPermissions,
};
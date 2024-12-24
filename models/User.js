const mongoose = require('mongoose'); // Import mongoose for MongoDB schema definition

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    username: { 
        type: String, // Data type is String
        required: true, // The username is required
        unique: true, // The username must be unique in the database
    },
    email: { 
        type: String, // Data type is String
        required: true, // The email is required
        unique: true, // The email must be unique in the database
    },
    password: { 
        type: String, // Data type is String
        required: true, // The password is required
    },
    confirmationToken: { 
        type: String, // Data type is String for storing the confirmation token
        // This field is not required as it will only be present if the user hasn't confirmed their email yet
    },
    isConfirmed: { 
        type: Boolean, // Data type is Boolean
        default: false, // Default value is false, indicating the user hasn't confirmed their email yet
    },
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields for the document

// Export the 'User' model using the defined schema
module.exports = mongoose.model('User', userSchema);

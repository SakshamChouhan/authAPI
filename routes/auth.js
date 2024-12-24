const express = require('express'); // Import express for routing
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating JWTs
const User = require('../models/User'); // Import the User model (assumed to be a mongoose model)
const validator = require('validator'); // Import validator for input validation
const crypto = require('crypto'); // Import crypto for generating secure tokens
const nodemailer = require('nodemailer'); // Import nodemailer for sending emails
const router = express.Router(); // Create a router instance for handling routes

// Setup nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail as the email service
    auth: {
        user: process.env.EMAIL_USER, // Your email address from environment variables
        pass: process.env.EMAIL_PASSWORD, // App password or your Gmail password from environment variables
    },
});

// Helper function to send a confirmation email
const sendConfirmationEmail = (email, confirmationLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email address
        to: email, // Recipient email address
        subject: 'Confirm your email address', // Email subject
        html: `<p>Please click the following link to confirm your email address:</p><a href="${confirmationLink}">${confirmationLink}</a>`, // Email body with confirmation link
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error); // Log error if email fails to send
            return;
        }
        console.log('Email sent:', info.response); // Log success message if email is sent
    });
};

// Signup Endpoint for creating a new user
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body; // Destructure username, email, and password from request body

        // Validate inputs
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' }); // If any field is missing, return a 400 response
        }

        if (!validator.isEmail(email)) { // Validate email format
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' }); // If email exists, return error
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 12); // 12 is the salt rounds

        // Generate a random confirmation token using crypto
        const confirmationToken = crypto.randomBytes(20).toString('hex'); // Generate a 20-byte token

        // Create a new user and save it to the database
        const user = new User({
            username,
            email,
            password: hashedPassword,
            confirmationToken, // Save the confirmation token in the database
        });

        await user.save(); // Save the new user

        // Generate the confirmation link and send the confirmation email
        const confirmationLink = `http://localhost:5000/api/confirm/${confirmationToken}`;
        sendConfirmationEmail(email, confirmationLink); // Send email with the confirmation link

        res.status(201).json({
            message: 'User registered successfully. Please check your email to confirm your account.' // Success response
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message }); // Error handling
    }
});

// Email Confirmation Endpoint
router.get('/confirm/:token', async (req, res) => {
    try {
        const { token } = req.params; // Extract the token from URL params

        // Find user by the confirmation token
        const user = await User.findOne({ confirmationToken: token });
        if (!user) {
            return res.status(404).json({ message: 'Invalid or expired token' }); // If token is invalid or expired, return error
        }

        // Set user as confirmed and clear the confirmation token
        user.isConfirmed = true;
        user.confirmationToken = null; // Remove the token after confirmation

        await user.save(); // Save the updated user status

        res.status(200).json({ message: 'Email confirmed successfully' }); // Return success message
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message }); // Error handling
    }
});

// Login Endpoint for user authentication
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // Extract email and password from the request body

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' }); // If any field is missing, return error
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // If user doesn't exist, return error
        }

        // Check if the user's email is confirmed
        if (!user.isConfirmed) {
            return res.status(400).json({ message: 'Please confirm your email address before logging in' }); // If email is not confirmed, return error
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' }); // If passwords don't match, return error
        }

        // Generate JWT token for the user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
        res.status(200).json({ token }); // Return the JWT token
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message }); // Error handling
    }
});

// Profile Endpoint for fetching user profile details
router.get('/profile', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', ''); // Extract token from Authorization header

        if (!token) {
            return res.status(400).json({ message: 'Token is required' }); // If token is missing, return error
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by decoded ID and exclude password
        const user = await User.findById(decoded.id).select('-password'); // Don't return password in the profile

        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // If user is not found, return error
        }

        res.status(200).json(user); // Return user profile data
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized', error: err.message }); // If token verification fails, return error
    }
});

module.exports = router; // Export the router for use in the main app

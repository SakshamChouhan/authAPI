require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import express for creating the server
const mongoose = require('mongoose'); // Import mongoose to interact with MongoDB
const swaggerUi = require('swagger-ui-express'); // Import swagger-ui-express to serve API docs
const YAML = require('yamljs'); // Import yamljs to parse YAML files
const swaggerDocument = YAML.load('./swagger.yaml'); // Load the Swagger documentation from the yaml file

const app = express(); // Create an Express application instance

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGO_URI, { 
    // Configuration options for mongoose can be added here if needed (e.g., useNewUrlParser: true)
}).then(() => {
    console.log('MongoDB connected'); // Log success message if connected to MongoDB
}).catch((err) => {
    console.error('MongoDB connection error:', err); // Log any connection error
});

app.use(express.json()); // Middleware to parse incoming JSON requests

// Set up the Swagger UI for API documentation at '/api-docs'
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Set up the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start the Express server and log the port it's running on
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Import authentication routes from a separate file
const authRoutes = require('./routes/auth');

// Set up route handling for '/api' to use the authRoutes
app.use('/api', authRoutes);

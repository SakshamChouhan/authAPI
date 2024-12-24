**Authentication API with Email Verification and JWT**

This project is a RESTful API built with Node.js, Express, and MongoDB, designed to handle user authentication and profile management. It includes features such as user registration, email verification, secure login with hashed passwords, and JWT-based session management.

**Features**
User Signup: New users can register with a username, email, and password.

Email Confirmation: Sends a confirmation email to verify the user's email address.

Secure Login: Users can log in with their email and password, with JWT tokens for session management.

Protected Profile Route: Access user profiles using a valid JWT token.

Interactive API Documentation: Explore and test the API via Swagger at http://localhost:5000/api-docs/#/.

**Tech Stack**
Backend: Node.js, Express
Database: MongoDB Atlas (via Mongoose)
Authentication: bcrypt for password hashing, JWT for session management
Email Service: Nodemailer (supports Gmail)
API Documentation: Swagger

**Getting Started**

1. Clone the repository:
git clone <repository-url>
cd <repository-name>

2. Install dependencies:
npm install
Set up environment variables:

3. Create a .env file in the root directory (refer to the .env.sample file).
Add the following variables:

MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
EMAIL_USER=your-email
EMAIL_PASSWORD=your-email-password

4. Run the server:
npm start


Open http://localhost:5000/api-docs/#/ to view the interactive API documentation.

# Authentication API with Email Verification and JWT

This project is a RESTful API built with Node.js, Express, and MongoDB, designed to handle user authentication and profile management. It includes features such as user registration, email verification, secure login with hashed passwords, and JWT-based session management.

## Features
- **User Signup**: New users can register with a username, email, and password.
- **Email Confirmation**: Sends a confirmation email to verify the user's email address.
- **Secure Login**: Users can log in with their email and password, with JWT tokens for session management.
- **Protected Profile Route**: Access user profiles using a valid JWT token.
- **Interactive API Documentation**: Explore and test the API via Swagger at [http://localhost:5000/api-docs/#/](http://localhost:5000/api-docs/#/).

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas (via Mongoose)
- **Authentication**: bcrypt for password hashing, JWT for session management
- **Email Service**: Nodemailer (supports Gmail)
- **API Documentation**: Swagger

## Getting Started

### Prerequisites
- Node.js (v16 or earlier)
- MongoDB Atlas account
- Email account (e.g., Gmail) for sending confirmation emails

### Steps to Set Up and Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/SakshamChouhan/authAP
   cd authAPI
2. Install dependencies:
   ```bash
   npm install

3. Set up environment variables:
   - Create a `.env` file in the root directory (refer to the `.env.sample` file).
   - Add the following variables:
     ```plaintext
     MONGO_URI=your-mongodb-connection-string
     JWT_SECRET=your-jwt-secret
     EMAIL_USER=your-email
     EMAIL_PASSWORD=your-email-password
     ```

4. Run the server:
   ```bash
   npm start
   
5. Open the API documentation:  
   Navigate to [http://localhost:5000/api-docs/#/](http://localhost:5000/api-docs/#/) in your browser to explore the interactive API documentation.

## API Endpoints

| Endpoint             | Method | Description                                  |
|----------------------|--------|----------------------------------------------|
| `/api/signup`        | POST   | Register a new user.                        |
| `/api/confirm/:token`| GET    | Confirm a user's email address.             |
| `/api/login`         | POST   | Authenticate a user and return a JWT token. |
| `/api/profile`       | GET    | Fetch the authenticated user's profile.     |


const express = require('express');
require('dotenv').config();
const bookingRouter = require('./router/bookingRouter');
const db = require('./db/dataBase');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const corsOptions = {
    origin: process.env.FRONTEND, // Replace with your frontend URL
    methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
  };
// Middleware
app.use(express.json());
app.use(cors(corsOptions)); // Enable CORS for all routes
morgan.token('req-body', (req) => JSON.stringify(req.body)); // Log request payload
morgan.token('res-body', (req, res) => JSON.stringify(res.body)); // Log response body
morgan.token('error-message', (req, res) => res.locals.errorMessage || ''); // Log error message

app.use(morgan(':method :url :status :response-time ms - :req-body - :res-body - :error-message'));
// Routes
app.use('/', bookingRouter);

// Database Connection
db();

// Start Server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
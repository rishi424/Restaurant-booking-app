const express = require('express');
require('dotenv').config();
const bookingRouter = require('./router/bookingRouter');
const db = require('./db/dataBase');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = ['https://resturent-frontend.vercel.app']; // Add your frontend domain here
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
  })
);
morgan.token('req-body', (req) => JSON.stringify(req.body)); // Log request payload
morgan.token('res-body', (req, res) => JSON.stringify(res.body)); // Log response body
morgan.token('error-message', (req, res) => res.locals.errorMessage || ''); // Log error message

app.use(morgan(':method :url :status :response-time ms - :req-body - :res-body - :error-message'));
// Routes
app.use('/', bookingRouter);
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

// Database Connection
db();

// Start Server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from './db.js'; // connects and exports mongoose.connection
import userRoutes from './routes/userRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import { jwtAuthMiddleware } from './jwt.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const logRequest = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};
app.use(logRequest);

app.use('/user', userRoutes);
app.use('/candidate',jwtAuthMiddleware, candidateRoutes); //added middleware to all candidate routes so that all routes are protected, only Role="admin" can access

// ✅ Wait for DB connection before starting server
mongoose.once('open', () => {
    console.log('🟢 MongoDB is connected. Starting server...');
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
});

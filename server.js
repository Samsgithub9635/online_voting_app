import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
app.use(bodyParser.json()); //req.body
const PORT = process.env.PORT || 3000;

// importing route files
import userRoutes from './routes/userRoutes.js';

// using the routes
// app.use is used to set the same route path for all urls
app.use('/user', userRoutes);

app.listen(PORT, () => {
    console.log('Listening on port 3000...');
})
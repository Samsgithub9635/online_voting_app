import express from 'express';
const app = express();
// require('dotenv').config();

import bodyParser from 'body-parser';
app.use(bodyParser.json()); //req.body
const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log('Listening on port 3000...');
})
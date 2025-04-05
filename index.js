
const express = require('express');

import { PORT } from './config/env.js';

const app = express();


app.get('/', (req, res) => {
    res.send('Fuck off!');
});

app.listen( PORT , () => {
    console.log( `Server is running on port ${PORT}` );
}
);
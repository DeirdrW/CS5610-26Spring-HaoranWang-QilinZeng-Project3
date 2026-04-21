import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';

import userRouter from './backend/api/user.api.js';
import sudokuRouter from './backend/api/sudoku.api.js';
import highscoreRouter from './backend/api/highscore.api.js';

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRouter);
app.use('/api/sudoku', sudokuRouter);
app.use('/api/highscore', highscoreRouter);

mongoose
    .connect(MONGODB_URL)
    .then(function () {
        console.log('Connected to MongoDB');
    })
    .catch(function (error) {
        console.error('Error connecting to MongoDB:', error);
    });

const frontendDir = path.join(path.resolve(), 'dist');

app.use(express.static(frontendDir));
app.get('*', function (req, res) {
    res.sendFile(path.join(frontendDir, 'index.html'));
});

app.listen(PORT, function () {
    console.log(`Server running on port ${PORT}`);
});

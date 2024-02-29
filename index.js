// Purpose: This file is the main file for the server. It connects to the database and listens for requests from the client. It also contains the logic for the login and sign up requests.

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(express.json({ limit: '10mb' }));
const port = 3000;

mongoose.connect('mongodb://localhost:27017/instagram').then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    })
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
    const userRouter = require('./routers/user.js')(db);
    app.use('/user', userRouter);
    const postRouter = require('./routers/post.js')(db);
    app.use('/post', postRouter);
    const feedRouter = require('./routers/feed.js')(db);
    app.use('/feed', feedRouter);
});

app.use(express.static('public'));

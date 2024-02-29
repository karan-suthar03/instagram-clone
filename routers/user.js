const {Types} = require("mongoose");
module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    const bodyParser = require('body-parser');
    router.use(express.json({ limit: '10mb' }));

    router.post('/login', (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        const usernamePattern = /^[a-zA-Z0-9_]{4,20}$/;
        const passwordPattern = /^(?!\s)(?=.*\S)(?=.*\S$).{8,}$/;
        if (username.trim() === "") {
            res.json({success: false, message: 'Username cannot be empty'});
        } else if (!usernamePattern.test(username)) {
            res.json({
                success: false,
                message: 'Username must be between 4 to 20 characters and contain only letters, numbers, and underscores'
            });
        } else if (password.trim() === "") {
            res.json({success: false, message: 'Password cannot be empty'});
        } else if (!passwordPattern.test(password)) {
            res.json({success: false, message: 'Password must be at least 8 characters long'});
        } else {
            console.log(username);
            db.collection('users').findOne({username: username})
                .then((user, err) => {
                    if (err) {
                        res.json({success: false, message: err});
                        return;
                    }
                    if (!user) {
                        res.json({success: false, message: 'Username does not exist'});
                        return;
                    }
                    if (user.password !== password) {
                        res.json({success: false, message: 'Password is incorrect'});
                        return;
                    }
                    res.json({success: true, message: 'Login Successful', id: user._id});
                })
        }
    });
    router.post('/signUp', (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let usernamePattern = /^[a-zA-Z0-9_]{4,20}$/;
        let passwordPattern = /^(?!\s)(?=.*\S)(?=.*\S$).{8,}$/;
        if (username.trim() === "") {
            res.json({success: false, message: 'Username cannot be empty'});
        } else if (!usernamePattern.test(username)) {
            res.json({
                success: false,
                message: 'Username must be between 4 to 20 characters and contain only letters, numbers, and underscores'
            });
        } else if (password.trim() === "") {
            res.json({success: false, message: 'Password cannot be empty'});
        } else if (!passwordPattern.test(password)) {
            res.json({success: false, message: 'Password must be at least 8 characters long'});
        } else {
            db.collection('users').findOne({username: username})
                .then((user, err) => {
                    if (err) {
                        res.json({success: false, message: err});
                        return;
                    }
                    if (user) {
                        res.json({success: false, message: 'Username already exists'});
                        return;
                    }
                    db.collection('users').insertOne({username, password})
                        .then((result, err) => {
                            res.json({success: true, message: 'signUP Successful', id: result.insertedId.toString()});
                        })
                })
        }
    });
    router.post('/isUserValid', (req, res) => {
        let id = req.body.id;
        db.collection('users').findOne({_id: new Types.ObjectId(id)})
            .then((user, err) => {
                if (err) {
                    res.json({success: false, message: err});
                    return;
                }
                if (!user) {
                    res.json({success: false, message: 'User does not exist'});
                    return;
                }
                res.json({success: true, message: 'User exists'});
            })
    });
    return router;
}
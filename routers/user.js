module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    const mongoose = require("mongoose");
    const Types = mongoose.Types;
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
                    db.collection('users').insertOne({username:username, password: password,bio: '', followers: [], following: [], posts: []})
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
                res.json({success: true, message: 'User exists',username: user.username});
            })
    });
    router.post('/getUser', (req, res) => {
        let username = req.query.username;
        let myUsername = req.body.myUsername;
        let dataSent = {isMe: false, followers: 0, following: 0, bio: '', posts: []};
        db.collection('users').findOne({_id: new Types.ObjectId(myUsername)})
            .then((user, err) => {
                if (err) {
                    res.json({success: false, message: err});
                    return;
                }
                if (!user) {
                    res.json({success: false, message: 'User does not exist'});
                    return;
                }
                if (user.username === username) {
                    dataSent.isMe = true;
                }
                db.collection('users').findOne({username: username})
                    .then((user, err) => {
                        if(!user){
                            res.json({success: false, message: 'User does not exist'});
                            return;
                        }
                        console.log(user);
                        dataSent.followers = user.followers.length;
                        dataSent.following = user.following.length;
                        dataSent.bio = user.bio;
                        db.collection('posts').find({UserId: user._id.toString()}).toArray()
                            .then((posts, err) => {
                                if (err) {
                                    res.json({success: false, message: err});
                                    return;
                                }
                                let postsArray = [];
                                for (let i = 0; i < posts.length; i++) {
                                    postsArray[i] = posts[i]._id.toString()+'.png';
                                }
                                dataSent.posts = postsArray;
                                res.json({success: true, message: 'User exists', data: dataSent});
                            })
                    });
            });
    });
    router.get('/getUserDetails', (req, res) => {
        let userId = req.query.userId;
        console.log(userId);
        db.collection('users').findOne({_id: new Types.ObjectId(userId)})
            .then((user, err) => {
                if (err) {
                    res.json({success: false, message: err});
                    return;
                }
                if (!user) {
                    res.json({success: false, message: 'User does not exist'});
                    return;
                }
                let profile;
                if(user.profile === 'default'){
                    profile = '/home/Default_pfp.jpg';
                }else{
                    profile = '/user/profiles/'+user.username.toString()+'.png';
                }
                res.json({success: true, message: 'User exists', data: {username: user.username, bio: user.bio, profile: profile}});
            });
    });
    router.post('/editProfile', (req, res) => {
        let data = req.body;
        if(data.isProfile){
            let profile = data.profile;
            let base64Data = profile.replace(/^data:image\/png;base64,/, "");
            db.collection('users').findOne({_id: new Types.ObjectId(data.id)}).then((result, err) => {
                require("fs").writeFile('public/user/profiles/'+result.username+'.png', base64Data, 'base64', function(err) {
                    console.log(err);
                });
                db.collection('users').updateOne({_id: new Types.ObjectId(data.id)}, {$set: {profile: 'changed'}});
            });
        }
        if(data.isBio){
            db.collection('users').updateOne({_id: new Types.ObjectId(data.id)}, {$set: {bio: data.bioText}});
        }
        res.json({success: true, message: 'Changes saved'});
    });
    return router;
}
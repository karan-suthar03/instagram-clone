module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    router.use(express.json({ limit: '10mb' }));
    const fs = require('fs');
    const path = require('path');
    const {Types} = require("mongoose");

    router.get('/load', (req, res) => {
        db.collection('posts').find().toArray()
            .then(async posts => {
                let data = [];
                for (const post of posts) {
                    const user = await db.collection('users').findOne({ _id: new Types.ObjectId(post.UserId) });
                    if(!user) {
                        console.error('User not found for post:', post);
                        continue;
                    }
                    data.push({
                        username: user.username,
                        caption: post.caption,
                        likes: post.likes,
                        comments: post.comments,
                        created: post.created,
                        image: '/posts/' + post._id +"."+post.type
                    });
                }
                res.json(data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                res.status(500).json({ success: false, message: 'Error fetching posts', error: error });
            });
    });
    return router;
}
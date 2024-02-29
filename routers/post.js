const {Types} = require("mongoose");
const fs = require("fs");
const mongoose = require("mongoose");
module.exports = function(db) {
    const express = require('express');
    const router = express.Router();
    router.use(express.json({ limit: '10mb' }));
    const fs = require('fs');
    const path = require('path');

    router.post('/create', (req, res) => {
        let imageDataBuffer = Buffer.from(req.body.image.split(",")[1], 'base64');
        let imageType = req.body.image.split(",")[0].split("/")[1].split(";")[0];
        let caption = req.body.caption;

        db.collection('posts').insertOne({caption: caption, UserId: req.body.id,likes: 0, comments: [],created: new Date(),type:imageType}).then((result, err) => {
            if (err) {
                res.json({success: false, message: err});
                return;
            }
            let image = result.insertedId + "." + imageType;
            fs.writeFile('public/posts/' + image, imageDataBuffer, function(err) {
                console.log(err);
                if (err) {
                    res.json({success: false, message: err});
                    return;
                }
                res.json({success: true, message: 'Post Created'});
            });
        });
    });

    return router;
}
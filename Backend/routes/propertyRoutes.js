const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const upload = require('../middleware/upload');

// ১. সব প্রপার্টি দেখার API (GET Request)
router.get('/', async (req, res) => {
    try {
        // নতুন প্রপার্টি আগে দেখানোর জন্য sort করা হলো
        const properties = await Property.find().sort({ createdAt: -1 });
        res.status(200).json(properties);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ২. নতুন প্রপার্টি ও ছবি অ্যাড করার API (POST Request)
// upload.array('images', 5) মানে হলো একসাথে সর্বোচ্চ ৫টি ছবি আপলোড করা যাবে
router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        // আপলোড হওয়া ছবিগুলোর লোকাল পাথ তৈরি করা (যেমন: /uploads/filename.jpg)
        const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const newProperty = new Property({
            title: req.body.title,
            description: req.body.description,
            priceInfo: req.body.priceInfo,
            location: req.body.location,
            images: imageUrls
        });

        const savedProperty = await newProperty.save();
        res.status(201).json({ message: 'Property added successfully!', data: savedProperty });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
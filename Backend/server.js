const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully...'))
  .catch((err) => console.log('❌ MongoDB Connection Failed:', err));

// Cloudinary Config (আপনার .env ফাইল থেকে ডেটা নেবে)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Shopno_Properties', // Cloudinary-তে এই নামে ফোল্ডার তৈরি হবে
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  },
});
const upload = multer({ storage: storage });

// Property Schema
const propertySchema = new mongoose.Schema({
    title: String,
    location: String,
    description: String,
    whyBest: String,
    allocationPolicy: String,
    image: String, // এখানে এখন Cloudinary-র লাইভ লিংক সেভ হবে
    isBanner: { type: Boolean, default: false }
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);

// GET All Properties
app.get('/api/properties', async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: "Error fetching properties" });
    }
});

// GET Single Property
app.get('/api/properties/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Not found" });
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
});

// POST New Property (Cloudinary তে আপলোড)
app.post('/api/properties', upload.single('image'), async (req, res) => {
    try {
        const { title, location, description, whyBest, allocationPolicy, isBanner } = req.body;
        // req.file.path এখন সরাসরি Cloudinary-র ছবির লাইভ লিংক দেবে
        const imagePath = req.file ? req.file.path : "";

        const newProperty = new Property({
            title, location, description, whyBest, allocationPolicy,
            image: imagePath,
            isBanner: isBanner === 'true'
        });

        await newProperty.save();
        res.status(201).json({ message: "Saved successfully!", data: newProperty });
    } catch (error) {
        res.status(500).json({ message: "Error saving data", error: error.message });
    }
});

// PUT (Update Property)
app.put('/api/properties/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, location, description, whyBest, allocationPolicy, isBanner } = req.body;
        let updateData = { title, location, description, whyBest, allocationPolicy, isBanner: isBanner === 'true' };

        if (req.file) {
            updateData.image = req.file.path; // নতুন ছবি দিলে ক্লাউডের লিংক বসবে
        }

        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ message: "Updated successfully!", data: updatedProperty });
    } catch (error) {
        res.status(500).json({ message: "Error updating property" });
    }
});

// DELETE Property
app.delete('/api/properties/:id', async (req, res) => {
    try {
        await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting property" });
    }
});

app.listen(process.env.PORT || 5000, () => console.log(`🚀 Server running on port ${process.env.PORT || 5000}`));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully...'))
  .catch((err) => console.log('❌ MongoDB Connection Failed:', err));

// আপডেট করা Schema (Price বাদ, নতুন ফিল্ড যোগ)
const propertySchema = new mongoose.Schema({
    title: String,
    location: String,
    description: String,
    whyBest: String,           // নতুন: Why this is the best
    allocationPolicy: String,  // নতুন: Plot Allocation Policy
    image: String,
    isBanner: { type: Boolean, default: false }
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/api/properties', async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: "Error fetching properties" });
    }
});

app.get('/api/properties/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Not found" });
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
});

app.post('/api/properties', upload.single('image'), async (req, res) => {
    try {
        const { title, location, description, whyBest, allocationPolicy, isBanner } = req.body;
        const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : "";

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
// ৫. প্রপার্টি আপডেট বা এডিট করার জন্য (PUT)
app.put('/api/properties/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, location, description, whyBest, allocationPolicy, isBanner } = req.body;
        
        // যে ডেটাগুলো আপডেট হবে সেগুলো রেডি করা
        let updateData = { 
            title, location, description, whyBest, allocationPolicy, 
            isBanner: isBanner === 'true' 
        };

        // যদি এডিটের সময় নতুন কোনো ছবি দেয়, তবেই ছবি আপডেট হবে
        if (req.file) {
            updateData.image = req.file.path.replace(/\\/g, "/");
            
            // পুরনো ছবিটা মেমোরি থেকে ডিলিট করে দেওয়া (যাতে সার্ভার ভারী না হয়)
            const oldProp = await Property.findById(req.params.id);
            if (oldProp && oldProp.image && fs.existsSync(oldProp.image)) {
                fs.unlinkSync(oldProp.image);
            }
        }

        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ message: "Updated successfully!", data: updatedProperty });
    } catch (error) {
        res.status(500).json({ message: "Error updating property", error: error.message });
    }
});
app.delete('/api/properties/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (property && property.image && fs.existsSync(property.image)) {
            fs.unlinkSync(property.image);
        }
        await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting property" });
    }
});

app.listen(process.env.PORT || 5000, () => console.log(`🚀 Server running on port ${process.env.PORT || 5000}`));
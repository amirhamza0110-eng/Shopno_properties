const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },       // প্রজেক্টের নাম (যেমন: কক্সবাজার সি-ভিউ হোটেল)
    description: { type: String, required: true }, // বিস্তারিত বিবরণ
    priceInfo: { type: String },                   // দাম (যেমন: ৮০ হাজার টাকা/স্কয়ার ফিট)
    location: { type: String, required: true },    // লোকেশন
    images: [{ type: String }],                    // আপলোড করা ছবির লিংকগুলো এখানে থাকবে
    status: { type: String, enum: ['Available', 'Sold Out'], default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
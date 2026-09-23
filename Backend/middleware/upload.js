const multer = require('multer');
const path = require('path');

// ছবি কোথায় এবং কী নামে সেভ হবে তার কনফিগারেশন
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // আপনার তৈরি করা uploads ফোল্ডারে সেভ হবে
    },
    filename: function (req, file, cb) {
        // ফাইলের নাম ইউনিক করার জন্য ডেট ও র‍্যান্ডম নম্বর যোগ করা হলো
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// শুধু ছবি আপলোড করতে দেওয়ার ফিল্টার
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // সর্বোচ্চ ৫ মেগাবাইটের ছবি আপলোড করা যাবে
});

module.exports = upload;
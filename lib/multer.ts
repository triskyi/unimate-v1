// lib/middleware/multer.ts
import multer from 'multer';
import path from 'path';

// Define storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Define the file name
  }
});

// Initialize multer with storage options
const upload = multer({ storage: storage });

export default upload;

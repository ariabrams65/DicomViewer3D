const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadDicom } = require('../controllers/dicom');

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (_req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

router.post('/', upload.single('dicom'), uploadDicom);

module.exports = router;


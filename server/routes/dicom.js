const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const config = require('../../config');
const { v4: uuidv4 } = require('uuid');
const { uploadDicom } = require('../controllers/dicom');

const storage = multer.diskStorage({
    // destination: function (_req, _file, cb) {
    //     if (!fs.existsSync(config.dicomFolder)) {
    //         fs.mkdirSync(config.dicomFolder);
    //     }
    //     cb(null, config.dicomFolder);
    // },
    filename: function (_req, file, cb) {
        cb(null, uuidv4() + '-' + file.originalname);
    }
});
const upload = multer({storage: storage});

router.post('/', upload.single('dicom'), uploadDicom);

module.exports = router;


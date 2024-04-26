const dicomService = require('../services/dicom');

async function uploadDicom(req, res, next) {
    try {
        await dicomService.generateSTL(req.file.path);
        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        next(e);
    }
}

module.exports = { uploadDicom };

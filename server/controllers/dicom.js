const dicomService = require('../services/dicom');

async function uploadDicom(req, res, next) {
    try {
        const modelId = await dicomService.generateSTL(req.file.path);
        res.status(201).json({modelId: modelId});
    } catch (e) {
        console.log(e);
        next(e);
    }
}

module.exports = { uploadDicom };

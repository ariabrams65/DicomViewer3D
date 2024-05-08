const dicomService = require('../services/dicom');
const fs = require('fs');

async function uploadDicom(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json('Missing file');
        }
        if (!dicomService.isValid(req.file.path)) {
            return res.status(400).json('Dicom files are missing from folder');
        }
        dicomService.clean(req.file.path);

        const modelId = await dicomService.generateModels(req.file.path);
        res.status(201).json({modelId: modelId});

        //Deleting dicom files after generating models
        fs.unlinkSync(req.file.path);
    } catch (e) {
        console.log(e);
        next(e);
    }
}

module.exports = { uploadDicom };

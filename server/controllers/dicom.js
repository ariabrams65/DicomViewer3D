const dicomService = require("../services/dicom");
const fs = require("fs");

async function uploadDicom(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json("Missing file");
    }
    if (!dicomService.isZip(req.file.path)) {
      return res.status(400).json("File is not a zip");
    }
    const folder = dicomService.unzip(req.file.path);
    if (!dicomService.isValid(folder)) {
      return res.status(400).json("Dicom files are missing from folder");
    }

    dicomService.filterDicom(folder);

    const modelId = await dicomService.generateModels(folder);
    res.status(201).json({ modelId: modelId });

    //Deleting dicom files after generating models
    fs.rmSync(folder, { recursive: true, force: true });
  } catch (e) {
    console.log(e);
    next(e);
  }
}

module.exports = { uploadDicom };

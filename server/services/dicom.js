const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const AdmZip = require('adm-zip');
const config = require('../../config');

async function generateModels(inputFolder) {
    //create the folder where the models will be stored
    const modelId = uuidv4();
    const outputFolder = createOutputFolder(modelId);

    //run the script to create the model
    const command = getScriptCommand(inputFolder, outputFolder);
    const result = child_process.execSync(command);
    console.log(result.toString());

    return modelId;
}

function createOutputFolder(modelId) {
    //Creating the folder where the model will live
    const folder = path.join(config.modelFolder, modelId);
    fs.mkdirSync(folder, {recursive: true});
    return folder;
}

function getScriptCommand(inputFolder, outputFolder) {
    const scriptPath =  `${path.join(__dirname, '../slicer/script.py')}`;
    const scriptArgs = `${inputFolder} ${outputFolder}`;
    return `"${process.env.SLICER_EXECUTABLE}" --python-script ${scriptPath} ${scriptArgs}`;
}

function isValid(dicomFolder) {
    //returns false if there aren't enough .dcm files in folder
    return true

}

function isZip(file) {
    //returns true if the given file is a zip archive
    return true;
}

function unzip(zipFile) {
    //unzips file into config.dicomFolder and returns the subfolder path
    const zip = new AdmZip(zipFile);
    const targetFolder = path.join(config.dicomFolder, uuidv4());
    fs.mkdirSync(targetFolder, {recursive: true});

    zip.extractAllTo(targetFolder, true);
    return targetFolder;
}

module.exports = { generateModels, isValid, unzip, isZip };

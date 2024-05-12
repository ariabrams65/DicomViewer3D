const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
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
    if (!fs.existsSync(config.modelFolder)) {
        fs.mkdirSync(config.modelFolder, {recursive: true});
    }
    //Creating the folder where the model will live
    const folder = path.join(config.modelFolder, modelId);
    fs.mkdirSync(folder, {recursive: true});
    return folder;
}

function getScriptCommand(inputFolder, outputFolder) {
    const scriptPath =  `${path.join(__dirname, '../slicer/script.py')}`;
    const scriptArgs = `${path.join(config.dicomFolder, inputFolder)} ${path.join(config.modelFolder, outputFolder)}`;
    return `"${process.env.SLICER_EXECUTABLE}" --python-script ${scriptPath} ${scriptArgs}`;
}

function isValid(dicomFolder) {
    //returns false if there aren't enough .dcm files in folder
    return true

}

function clean(dicomFolder) {
    //removes non .dcm files from folder

}

module.exports = { generateModels, isValid, clean };

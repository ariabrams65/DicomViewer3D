const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../../config');

async function generateModels(dicomFolder) {
    //create the folder where the models will be stored
    const modelId = uuidv4();
    const folder = createOutputFolder(modelId);

    //create an array for the 4 argument strings for each tissue type
    all_args = [];
    for (const type of ['soft_tissue', 'skin', 'bone', 'fat']) {
        const outputFile = path.join(folder, `${type}.stl`);
        const args = `-a -t ${type} --reduce 0 --smooth 25 -l -o ${outputFile} ${dicomFolder}`;
        all_args.push(args);
    }

    //run the script 4 times to create the models
    const command = getScriptCommand();
    for (const args of all_args) {
        const result = child_process.execSync(`${command} ${args}`);
        console.log(result.toString());
    } 

    return modelId;
}

function createOutputFolder(modelId) {
    if (!fs.existsSync(config.modelFolder)) {
        fs.mkdirSync(config.modelFolder, {recursive: true});
    }
    //Creating the folder where the 4 models will live
    const folder = path.join(config.modelFolder, modelId);
    fs.mkdirSync(folder, {recursive: true});
    return folder;
}

function getScriptCommand() {
    //Location of dicom2stl in virtual environment
    const pathToScriptUnix = path.join(__dirname, '..', '.venv', 'bin', 'dicom2stl');
    const pathToScriptWin = path.join(__dirname, '..', '.venv', 'Scripts', 'dicom2stl.exe');
    
    //Location of python in virtual environment
    const pythonEnvUnix = path.join(__dirname, '..', '.venv', 'bin', 'python');
    const pythonEnvWin = path.join(__dirname, '..', '.venv', 'Scripts', 'python.exe');

    const pythonEnv = process.platform === 'win32' ? pythonEnvWin : pythonEnvUnix;
    const pathToScript = process.platform === 'win32' ? pathToScriptWin : pathToScriptUnix;

    return `${pythonEnv} ${pathToScript}`;
}

function isValid(dicomFolder) {
    //returns false if there aren't enough .dcm files in folder
    return true

}

function clean(dicomFolder) {
    //removes non .dcm files from folder

}

module.exports = { generateModels, isValid, clean };

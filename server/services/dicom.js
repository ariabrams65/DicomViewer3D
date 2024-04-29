const child_process = require('child_process');
const path = require('path');
const fs = require('fs');

async function generateSTL(filePath) {
    //Location of dicom2stl in virtual environment
    const pathToScriptUnix = path.join(__dirname, '..', '.venv', 'bin', 'dicom2stl');
    const pathToScriptWin = path.join(__dirname, '..', '.venv', 'Scripts', 'dicom2stl.exe');
    
    //Location of python in virtual environment
    const pythonEnvUnix = path.join(__dirname, '..', '.venv', 'bin', 'python');
    const pythonEnvWin = path.join(__dirname, '..', '.venv', 'Scripts', 'python.exe');

    const pythonEnv = process.platform === 'win32' ? pythonEnvWin : pythonEnvUnix;
    const pathToScript = process.platform === 'win32' ? pathToScriptWin : pathToScriptUnix;

    const outputDir = path.join(__dirname, '../../client/texture');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {recursive: true});
    }
    const outputFile = path.join(outputDir, 'output.stl');

    const args = `-t soft_tissue --reduce 0 -o ${outputFile} ${filePath}`;
    const result = child_process.execSync(`${pythonEnv} ${pathToScript} ${args}`);
    console.log(result.toString());
}

module.exports = { generateSTL };

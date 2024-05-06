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
    const outputFile2 = path.join(outputDir, 'output2.stl');
    //const metaFile = path.join(outputDir, 'metadata.txt')
    const outputFile3 = path.join(outputDir, 'output3.stl');
    const outputFile4 = path.join(outputDir, 'output4.stl');
    const outputFile5 = path.join(outputDir, 'output5.stl');

    const args = `-a -t soft_tissue --reduce 0 --smooth 25 -l -o ${outputFile} ${filePath}`;
    const args2 = `-a -t skin --reduce 0 --smooth 25 -l -o ${outputFile2} ${filePath}`;
    const args3 = `-a -t bone --reduce 0 --smooth 25 -l -o ${outputFile3} ${filePath}`;
    const args4 = `-a -t fat --reduce 0 --smooth 25 -l -o ${outputFile4} ${filePath}`;
    const args5 = `-a -t two --reduce 0 --smooth 25 -o ${outputFile5} ${filePath}`;
    const result = child_process.execSync(`${pythonEnv} ${pathToScript} ${args}`);
    const result2 = child_process.execSync(`${pythonEnv} ${pathToScript} ${args2}`);
    const result3 = child_process.execSync(`${pythonEnv} ${pathToScript} ${args3}`);
    const result4 = child_process.execSync(`${pythonEnv} ${pathToScript} ${args4}`);
    const result5 = child_process.execSync(`${pythonEnv} ${pathToScript} ${args5}`);
    console.log(result.toString());
    console.log(result2.toString());
    console.log(result3.toString());
    console.log(result4.toString());
    console.log(result5.toString());
}

module.exports = { generateSTL };

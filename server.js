const express = require('express');
const app = express();
const multer = require('multer');
const child_process = require('child_process');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage})

app.use(express.json());
app.use(express.static('public'));

//For testing purposes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.post('/dicom', upload.single('dicom'), (req, res) => {
    //Location of dicom2stl in virtual environment
    const pathToScriptUnix = path.join(__dirname, '.venv', 'bin', 'dicom2stl');
    const pathToScriptWin = path.join(__dirname, '.venv', 'Scripts', 'dicom2stl.exe');
    
    //Location of python in virtual environment
    const pythonEnvUnix = path.join(__dirname, '.venv', 'bin', 'python');
    const pythonEnvWin = path.join(__dirname, '.venv', 'Scripts', 'python.exe');

    const pythonEnv = process.platform === 'win32' ? pythonEnvWin : pythonEnvUnix;
    const pathToScript = process.platform === 'win32' ? pathToScriptWin : pathToScriptUnix;

    const outputDir = path.join(__dirname, 'stl');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {recursive: true});
    }
    const outputFile = path.join(outputDir, 'output.stl');

    const args = `-t bone --reduce 0 -o ${outputFile} ${req.file.path}`;
    const result = child_process.execSync(`${pythonEnv} ${pathToScript} ${args}`);
    console.log(result.toString());

    //Just downloading the file for now but will eventually display 3d render in browser
    res.download(outputFile);
});

app.listen(3000);

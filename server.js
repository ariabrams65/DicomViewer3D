const express = require('express');
const app = express();
const multer = require('multer');
const child_process = require('child_process');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
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
    const pathToScript = '../.local/lib/python3.10/site-packages/dicom2stl/Dicom2STL.py';
    const args = `-t bone --reduce 0 -o ./stl/output.stl ${req.file.path}`;
    const result = child_process.execSync(`python3 ${pathToScript} ${args}`);
    console.log(result.toString());

    //downloading file for now but should do res.sendFile
    res.download('./stl/output.stl');
});

app.listen(3000);

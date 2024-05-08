const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

//For testing purposes
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.use('/api/dicom', require('./routes/dicom'));
app.use('/api/model', require('./routes/model'));

app.listen(3000);

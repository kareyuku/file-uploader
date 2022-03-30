const express = require('express');
const fileUpload = require('express-fileupload');
const app = new express();
const config = require('./config.json')


// Database Connection
const mongoose = require('mongoose');
mongoose.connect( config.db, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
})

const filesDB = require('./database/file');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(fileUpload())

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index.hbs', { title: "Upload File" })
})

app.get('/files/:id', async (req, res) => {
    const fileId = req.params?.id;
    try {
        if(!fileId) throw 'Missing ID';
        const file = await filesDB.findOne({url: fileId});
        if(!file) throw `File with ID ${fileId} not found`;
        res.render('download.hbs', {downloadUrl: `${config.domain}/api/v1/file/${fileId}`, file})
    } catch(err) {
        res.send(err)
    }
})

app.get('/api/v1/file/:id', async( req, res) => {
    const fileId = req.params?.id;
    try {
        if(!fileId) throw `Missing id`;
        const file = await filesDB.findOne({url: fileId});
        if(!file) throw `File with ID ${fileId} not found`;
        const filePath = `${__dirname}/data/files/${file.file}`;
        await res.download(filePath, file.fileName)
    } catch(error) {
        console.log(error);
        res.status(500).json({
            error
        })
    }
})

app.post('/api/v1/upload', async (req, res) => {

    if(!req.files || !req.files?.file ) return res.status(500).json({error: "Invalid POST Request"});

    try {
        const file = req.files?.file;
        const size = file.data.length;
        if(size > config.maxFileSizeMB * 1000000) throw 'File size is too large';

        const URL = `./data/files/${file.md5}`;
        file.mv(URL);

        const createdFile = await filesDB.create({
            file: file.md5,
            fileName: file.name
        })

        res.status(200).json({
            message: `File has been uploaded`,
            shortUrl: createdFile.url
        })

    } catch(error) {
        console.log(error);
        res.status(500).json({
            error
        })
    }

})

app.listen(config.port)
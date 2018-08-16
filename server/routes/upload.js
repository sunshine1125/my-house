const express = require('express');
const router = express.Router();
const multer = require('multer');
const qingstor = require('../tools/qingstor');
const fs = require('fs');

const config = process.env.NODE_ENV === 'development' ? require('../config/dev'): require('../config/prod');

let env = config.qingstor;
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/uploads')
    },
    filename   : (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
});
const upload = multer({storage: storage});

router.post('/upload', upload.single('file'), (req, res) => {
    qingstor.uploadObject(env, req.file.filename, req.file.path, req.file.mimetype).then(res => {
        let folder = fs.existsSync('public/uploads');
        if (folder) {
            let dirList = fs.readdirSync('public/uploads');
            dirList.forEach((fileName) => {
                fs.unlinkSync(`public/uploads/${fileName}`) // 删除uploads文件夹内容
            })
        }
        return res.url;
    }).then(url => {
        res.json({success: true, path: url});
    });
});

module.exports = router;

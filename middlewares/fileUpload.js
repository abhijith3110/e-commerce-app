import multer from "multer";
import path from 'path'
import fs from "fs";

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        const uploadPath = "uploads/";
        if (!fs.existsSync(uploadPath)) {

            fs.mkdirSync(uploadPath);
        }

        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {

        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }

})

export const uploadImage = multer({
    storage: storage,
    limits: {

        fieldSize: 1024 * 1024 * 10
    },
    
})
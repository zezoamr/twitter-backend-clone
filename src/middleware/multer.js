const multer = require('multer');
const sharp = require('sharp');

// use process functions in each route to process img before saving it to mongodb object
const ProcessAvatar = async (avatar) => await sharp(avatar).resize({width: 250, height: 250}).png().toBuffer() // avatar == req.file.buffer
const processBanner = async (banner) => await sharp(banner).resize({width: 500, height: 250}).png().toBuffer() // banner == req.file.buffer
const processImg = async (img) => await sharp(img).png().toBuffer() // img == req.files[i].buffer

const fileSize = 1000000; //max filesize
const maxUploadcount = 10;

const uploadUserBanner = multer({
    limits: {
        fileSize
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
}).single('banner') // This field name must match the name attribute of the <input type="file"> element in your HTML

const uploadUserProfileAvatar = multer({
    limits: {
        fileSize
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
}).single('profileAvater') // same as above

const uploadTweetGallery = multer({
    limits: {
        fileSize
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
}).array('gallery', maxUploadcount) // same as above


module.exports = {
    uploadUserBanner,
    uploadUserProfileAvatar,
    uploadTweetGallery,
    ProcessAvatar,
    processBanner,
    processImg
}

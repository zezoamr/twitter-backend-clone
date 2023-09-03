const multer = require('multer');
const sharp = require('sharp');

// use process functions in each route to process img before saving it to mongodb object
const userAvatarSize = {
    width: 250,
    height: 250
};
const userBannerSize = {
    width: 500,
    height: 250
};
const ProcessAvatar = async (avatar) => await sharp(avatar).resize(userAvatarSize).png().toBuffer() // avatar == req.file.buffer
const processBanner = async (banner) => await sharp(banner).resize(userBannerSize).png().toBuffer() // banner == req.file.buffer
const processImg = async (img) => await sharp(img).png().toBuffer() // img == req.files[i].buffer

const fileSize = 1000000; // max filesize
const maxUploadcount = 10;

const imgExtensionRegex = /\.(jpg|jpeg|png)$/;
const uploadUserBanner = multer({
    limits: {
        fileSize
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(imgExtensionRegex)) {
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
        if (!file.originalname.match(imgExtensionRegex)) {
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
        if (!file.originalname.match(imgExtensionRegex)) {
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

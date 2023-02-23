const conversationController = require('../controllers/conversationCntroller')
const messageController = require('../controllers/messageController')
const userController = require('../controllers/userController')
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../../public/media')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })
const apiRoutes = (app) => {
    app.get("/", userController().index)
    app.post("/signup", userController().signup)
    app.get("/user/:id", userController().getUserById)
    app.get("/users", userController().getUsers)
    app.post("/change-password/:id", userController().changePassword)
    app.post("/profile/:id", upload.single('file'), userController().updateProfile)
    app.post("/signin", userController().login)
    app.post('/verify-otp', userController().verifyOtp)
    app.post("/conversation", conversationController().createConversation)
    app.post("/message", messageController().postMessage)
    app.post("/message/file", upload.single('file'), messageController().postFileData)
    app.get("/messages/:id", messageController().getMessageByID)
    app.get("/converstions/:id", conversationController().getConversationById)
    app.post('/reset-password', userController().forgetPassword)
}
module.exports = apiRoutes;
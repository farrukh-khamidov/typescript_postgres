"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const post_1 = __importDefault(require("./routes/post"));
const user_1 = __importDefault(require("./routes/user"));
const multer_1 = __importDefault(require("multer"));
const app = express_1.default();
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png ' ||
        file.mimetype === 'image/jpg ' ||
        file.mimetype === 'image/jpeg ') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
app.use(body_parser_1.default.json());
app.use(multer_1.default({ storage: fileStorage, fileFilter }).single('image'));
app.use('/images', express_1.default.static(path_1.default.join(__dirname, 'images')));
app.use('/auth', auth_1.default);
app.use('/posts', post_1.default);
app.use('/user-posts', user_1.default);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message, data: error.data });
});
app.listen(3000, () => {
    console.log('Server on port ', 3000);
});

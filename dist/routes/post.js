"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const post_1 = require("../controllers/post");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const router = express_1.Router();
router.get('/', isAuth_1.default, post_1.getPosts);
router.post('/', [
    express_validator_1.body('title')
        .trim()
        .isLength({ min: 3 }),
    express_validator_1.body('content')
        .trim()
        .isLength({ min: 5 })
], isAuth_1.default, post_1.createPost);
router.put('/:id', [
    express_validator_1.body('title')
        .trim()
        .isLength({ min: 3 }),
    express_validator_1.body('content')
        .trim()
        .isLength({ min: 5 })
], isAuth_1.default, post_1.updatePost);
router.get('/:id', isAuth_1.default, post_1.getPost);
router.delete('/:id', isAuth_1.default, post_1.deletePost);
router.post('/like', isAuth_1.default, post_1.likePost);
exports.default = router;

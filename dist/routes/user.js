"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const router = express_1.Router();
router.get('/all', isAuth_1.default, user_1.getUserPosts);
router.get('/top-liked', isAuth_1.default, user_1.getTopLikedPosts);
router.get('/top-viewed', isAuth_1.default, user_1.getTopViewedPosts);
router.get('/info', isAuth_1.default, user_1.getUserPostsInfo);
exports.default = router;

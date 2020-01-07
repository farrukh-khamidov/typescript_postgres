"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = __importDefault(require("../models/Post"));
exports.getUserPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.userId) {
            const response = yield Post_1.default.fetchAllOfUser(req.userId);
            res.status(200).json({
                message: response.rows.length > 0
                    ? 'Posts fetched successfully'
                    : 'No posts yet!',
                posts: response.rows
            });
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.getTopLikedPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.userId) {
            const response = yield Post_1.default.fetchTopLikedOfUser(req.userId);
            res.status(200).json({
                message: response.rows.length > 0
                    ? 'Posts fetched successfully'
                    : 'No posts yet!',
                posts: response.rows
            });
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.getTopViewedPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.userId) {
            const response = yield Post_1.default.fetchTopViewedOfUser(req.userId);
            res.status(200).json({
                message: response.rows.length > 0
                    ? 'Posts fetched successfully'
                    : 'No posts yet!',
                posts: response.rows
            });
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.getUserPostsInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.userId) {
            const response = yield Post_1.default.fetchUserPostsInfo(req.userId);
            res.status(200).json({
                message: response.rows.length > 0
                    ? 'PostsInfo fetched successfully'
                    : 'No posts yet!',
                postsInfo: response.rows
            });
        }
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});

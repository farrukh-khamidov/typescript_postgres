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
const express_validator_1 = require("express-validator");
const Post_1 = __importDefault(require("../models/Post"));
exports.getPosts = (req, res, next) => {
    Post_1.default.fetchAll()
        .then(response => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: response.rows
        });
    })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
exports.getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +req.params.id;
        if (req.userId) {
            yield Post_1.default.incrementViewsCount(id, req.userId);
        }
        const response = yield Post_1.default.findById(id);
        if (response.rowCount !== 1) {
            return res.status(404).json({
                message: 'Post not found!'
            });
        }
        res.status(200).json({
            message: 'Post fetched successfully',
            post: response.rows[0]
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.createPost = (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    let post;
    if (req.userId) {
        post = new Post_1.default(req.body.title, req.body.content, req.userId);
    }
    else {
        const error = new Error('Not authenticsted');
        error.statusCode = 422;
        throw error;
    }
    post
        .save()
        .then(response => {
        res.status(201).json({
            message: 'Post created successfully',
            creatorId: req.userId
        });
    })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
exports.updatePost = (req, res, next) => {
    const id = +req.params.id;
    Post_1.default.findById(id)
        .then(response => {
        if (response.rowCount !== 1) {
            const error = new Error('Post not found!');
            error.statusCode = 403;
            throw error;
        }
        else {
            const post = response.rows[0];
            if (post.user_id !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }
            return Post_1.default.updateById(id, req.body.title, req.body.content, req.body.user_id);
        }
    })
        .then(response => {
        res.status(200).json({
            message: 'Post updated successfully'
        });
    })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
exports.deletePost = (req, res, next) => {
    const id = +req.params.id;
    Post_1.default.findById(id)
        .then(response => {
        if (response.rowCount !== 1) {
            const error = new Error('Post not found!');
            error.statusCode = 403;
            throw error;
        }
        else {
            const post = response.rows[0];
            if (post.user_id !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }
            return Post_1.default.deleteById(id);
        }
    })
        .then(response => {
        res.status(200).json({
            message: 'Post deleted successfully'
        });
    })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
exports.likePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        let response;
        if (req.userId) {
            response = yield Post_1.default.changeLikesCount(id, req.userId);
        }
        // res.redirect(`/posts/${id}`);
        res.json(response);
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});

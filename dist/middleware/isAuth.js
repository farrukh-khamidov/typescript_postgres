"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (req, res, next) => {
    const bearerToken = req.header('Authorization');
    let token;
    let decodedToken;
    if (bearerToken) {
        token = bearerToken.replace('Bearer ', '');
    }
    else {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, 'thisismytypescriptsupersecretkey');
    }
    catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};

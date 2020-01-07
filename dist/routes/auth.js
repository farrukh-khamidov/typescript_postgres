"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
const auth_1 = require("../controllers/auth");
const router = express_1.Router();
router.put('/signup', [
    express_validator_1.body('firstName')
        .trim()
        .not()
        .isEmpty(),
    express_validator_1.body('lastName')
        .trim()
        .not()
        .isEmpty(),
    express_validator_1.body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
        return User_1.User.findByEmail(value).then(response => {
            if (response.rowCount > 0) {
                return Promise.reject('E-Mail address already exists');
            }
        });
    }),
    express_validator_1.body('password')
        .trim()
        .isLength({ min: 5 })
], auth_1.signup);
router.post('/login', auth_1.login);
exports.default = router;

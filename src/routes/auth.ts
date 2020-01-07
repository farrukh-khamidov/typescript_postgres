import { Router, response } from 'express';
import { body } from 'express-validator';

import { User } from '../models/User';

import { signup, login } from '../controllers/auth';

const router = Router();

router.put(
  '/signup',
  [
    body('firstName')
      .trim()
      .not()
      .isEmpty(),
    body('lastName')
      .trim()
      .not()
      .isEmpty(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findByEmail(value).then(response => {
          if (response.rowCount > 0) {
            return Promise.reject('E-Mail address already exists');
          }
        });
      }),
    body('password')
      .trim()
      .isLength({ min: 5 })
  ],
  signup
);

router.post('/login', login);

export default router;

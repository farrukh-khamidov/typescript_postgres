import { Router } from 'express';
import { body } from 'express-validator';

import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost
} from '../controllers/post';

import isAuth from '../middleware/isAuth';

const router = Router();

router.get('/', isAuth, getPosts);
router.post(
  '/',
  [
    body('title')
      .trim()
      .isLength({ min: 3 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  isAuth,
  createPost
);

router.put(
  '/:id',
  [
    body('title')
      .trim()
      .isLength({ min: 3 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  isAuth,
  updatePost
);
router.get('/:id', isAuth, getPost);
router.delete('/:id', isAuth, deletePost);
router.post('/like', isAuth, likePost);

export default router;

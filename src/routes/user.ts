import { Router } from 'express';

import {
  getUserPosts,
  getTopLikedPosts,
  getTopViewedPosts,
  getUserPostsInfo
} from '../controllers/user';

import isAuth from '../middleware/isAuth';

const router = Router();

router.get('/all', isAuth, getUserPosts);
router.get('/top-liked', isAuth, getTopLikedPosts);
router.get('/top-viewed', isAuth, getTopViewedPosts);

router.get('/info', isAuth, getUserPostsInfo);

export default router;

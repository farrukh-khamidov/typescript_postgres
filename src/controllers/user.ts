import { Request, Response, NextFunction } from 'express';

import Post from '../models/Post';
import { IGetUserAuthInfoRequest } from '../utils/custom';

export const getUserPosts = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.userId) {
      const response = await Post.fetchAllOfUser(req.userId);

      res.status(200).json({
        message:
          response.rows.length > 0
            ? 'Posts fetched successfully'
            : 'No posts yet!',
        posts: response.rows
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getTopLikedPosts = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.userId) {
      const response = await Post.fetchTopLikedOfUser(req.userId);
      res.status(200).json({
        message:
          response.rows.length > 0
            ? 'Posts fetched successfully'
            : 'No posts yet!',
        posts: response.rows
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getTopViewedPosts = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.userId) {
      const response = await Post.fetchTopViewedOfUser(req.userId);
      res.status(200).json({
        message:
          response.rows.length > 0
            ? 'Posts fetched successfully'
            : 'No posts yet!',
        posts: response.rows
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getUserPostsInfo = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.userId) {
      const response = await Post.fetchUserPostsInfo(req.userId);
      res.status(200).json({
        message:
          response.rows.length > 0
            ? 'PostsInfo fetched successfully'
            : 'No posts yet!',
        postsInfo: response.rows
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Post from '../models/Post';
import { IGetUserAuthInfoRequest } from '../utils/custom';

export const getPosts = (req: Request, res: Response, next: NextFunction) => {
  Post.fetchAll()
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

export const getPost = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = +req.params.id;
    if (req.userId) {
      await Post.incrementViewsCount(id, req.userId);
    }
    const response = await Post.findById(id);
    if (response.rowCount !== 1) {
      return res.status(404).json({
        message: 'Post not found!'
      });
    }

    res.status(200).json({
      message: 'Post fetched successfully',
      post: response.rows[0]
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const createPost = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  let post: Post;
  if (req.userId) {
    post = new Post(req.body.title, req.body.content, req.userId);
  } else {
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

export const updatePost = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.userId) {
    const error = new Error('Not authenticsted');
    error.statusCode = 422;
    throw error;
  }
  const id = +req.params.id;
  Post.findById(id)
    .then(response => {
      if (response.rowCount !== 1) {
        const error = new Error('Post not found!');
        error.statusCode = 403;
        throw error;
      } else {
        const post = response.rows[0];

        if (post.user_id !== req.userId) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
        }
        return Post.updateById(
          id,
          req.body.title,
          req.body.content,
          req.userId ? req.userId
        );
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

export const deletePost = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const id = +req.params.id;

  Post.findById(id)
    .then(response => {
      if (response.rowCount !== 1) {
        const error = new Error('Post not found!');
        error.statusCode = 403;
        throw error;
      } else {
        const post = response.rows[0];

        if (post.user_id !== req.userId) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
        }
        return Post.deleteById(id);
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

export const likePost = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id: number = req.body.id;
    let response;
    if (req.userId) {
      response = await Post.changeLikesCount(id, req.userId);
    }

    // res.redirect(`/posts/${id}`);
    res.json(response);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

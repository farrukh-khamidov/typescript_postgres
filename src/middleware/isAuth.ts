import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IGetUserAuthInfoRequest } from '../utils/custom';

export default (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.header('Authorization');
  let token: string;
  let decodedToken: string | object;
  if (bearerToken) {
    token = bearerToken.replace('Bearer ', '');
  } else {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  try {
    decodedToken = jwt.verify(token, 'thisismytypescriptsupersecretkey');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }

  req.userId = (<any>decodedToken).userId;

  next();
};

import { Request } from 'express';
export interface IGetUserAuthInfoRequest extends Request {
  userId?: number; // or any other type
}

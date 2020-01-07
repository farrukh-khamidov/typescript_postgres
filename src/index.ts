import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';

import authRouter from './routes/auth';
import postRouter from './routes/post';
import userPostsRouter from './routes/user';
import multer from 'multer';

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (
  req: express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void
) => {
  if (
    file.mimetype === 'image/png ' ||
    file.mimetype === 'image/jpg ' ||
    file.mimetype === 'image/jpeg '
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/user-posts', userPostsRouter);

app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message, data: error.data });
  }
);

app.listen(3000, () => {
  console.log('Server on port ', 3000);
});

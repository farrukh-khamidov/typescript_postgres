CREATE DATABASE userpostsdb;

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(40) NOT NULL,
  lastname VARCHAR(40) NOT NULL,
  username VARCHAR(40) NOT NULL,
  email VARCHAR(40) UNIQUE NOT NULL,
  password TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts
(
  id SERIAL PRIMARY KEY,
  title VARCHAR(40) NOT NULL,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE posts_likes
(
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(post_id, user_id)
);

CREATE TABLE posts_views
(
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(post_id, user_id)
);

INSERT INTO users
  (firstname, lastname, username, password, email)
VALUES
  ('Farrux', 'Hamidov', 'farruxhamidov', 'farrux19941214', 'mrfarrukh.94@gmail.com');

INSERT INTO posts
  (title, content, user_id)
VALUES
  ('FirstPostTitle', 'this is first post text', 1),
  ('SecondPostTitle', 'this is second post text', 1),
  ('ThirdPostTitle', 'this is third post text', 1),
  ('FifthPostTitle', 'this is fifth post text', 1);
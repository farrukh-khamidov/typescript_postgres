import { pool } from '../db/db';

class Post {
  private title: string;
  private content: string;
  private userId: number;

  constructor(title: string, content: string, userId: number) {
    this.title = title;
    this.content = content;
    this.userId = userId;
  }

  save() {
    return pool.query(
      `INSERT INTO posts
    (title, content, user_id)
  VALUES
    ($1, $2, $3)
    RETURNING id;`,
      [this.title, this.content, this.userId]
    );
  }
  static fetchAll() {
    return pool.query('SELECT * FROM posts;');
  }
  static fetchAllOfUser(userId: number) {
    return pool.query('SELECT * FROM posts WHERE user_id = $1;', [userId]);
  }
  static fetchTopLikedOfUser(userId: number) {
    return pool.query(
      'SELECT * FROM posts WHERE user_id = $1 ORDER BY likes_count DESC LIMIT 10;',
      [userId]
    );
  }
  static fetchTopViewedOfUser(userId: number) {
    return pool.query(
      'SELECT * FROM posts WHERE user_id = $1 ORDER BY views_count DESC LIMIT 10;',
      [userId]
    );
  }
  static fetchUserPostsInfo(userId: number) {
    return pool.query(
      `SELECT COUNT(*) AS posts_number, DATE_TRUNC('day', created_at) AS date  FROM posts WHERE user_id = $1
      GROUP BY DATE_TRUNC('day', created_at);`,
      [userId]
    );
  }

  static findById(id: number) {
    return pool.query('SELECT * FROM posts WHERE id = $1;', [id]);
  }

  static updateById(
    id: number,
    title: string,
    content: string,
    userId: number
  ) {
    return pool.query(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4;',
      [title, content, id, userId]
    );
  }

  static deleteById(id: number) {
    return pool.query('DELETE FROM posts WHERE id = $1;', [id]);
  }

  static async incrementViewsCount(postId: number, userId: number) {
    const response = await pool.query(
      'SELECT * FROM posts_views WHERE post_id = $1 AND user_id = $2;',
      [postId, userId]
    );

    if (response.rowCount === 0) {
      await pool.query(
        `INSERT INTO posts_views
              (post_id, user_id)
            VALUES
              ($1, $2);`,
        [postId, userId]
      );

      await pool.query(
        'UPDATE posts SET views_count = views_count + 1 WHERE id = $1;',
        [postId]
      );
    }
  }

  static async changeLikesCount(postId: number, userId: number) {
    try {
      const response = await pool.query(
        'SELECT * FROM posts_likes WHERE post_id = $1 AND user_id = $2;',
        [postId, userId]
      );

      if (response.rowCount === 0) {
        await pool.query(
          `INSERT INTO posts_likes
                  (post_id, user_id)
                VALUES
                  ($1, $2);`,
          [postId, userId]
        );
        const result = await pool.query(
          'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1 RETURNING likes_count;',
          [postId]
        );
        console.log(result);
        return Promise.resolve({
          message: 'Like added!',
          likesCount: result.rows[0].likes_count
        });
      } else {
        await pool.query(
          `DELETE FROM posts_likes WHERE post_id = $1 AND user_id = $2`,
          [postId, userId]
        );
        const result = await pool.query(
          'UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1 RETURNING likes_count;',
          [postId]
        );
        return Promise.resolve({
          message: 'Like removed!',
          likesCount: result.rows[0].likes_count
        });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default Post;

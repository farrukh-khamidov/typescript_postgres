"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db/db");
class Post {
    constructor(title, content, userId) {
        this.title = title;
        this.content = content;
        this.userId = userId;
    }
    save() {
        return db_1.pool.query(`INSERT INTO posts
    (title, content, user_id)
  VALUES
    ($1, $2, $3)
    RETURNING id;`, [this.title, this.content, this.userId]);
    }
    static fetchAll() {
        return db_1.pool.query('SELECT * FROM posts;');
    }
    static fetchAllOfUser(userId) {
        return db_1.pool.query('SELECT * FROM posts WHERE user_id = $1;', [userId]);
    }
    static fetchTopLikedOfUser(userId) {
        return db_1.pool.query('SELECT * FROM posts WHERE user_id = $1 ORDER BY likes_count DESC LIMIT 10;', [userId]);
    }
    static fetchTopViewedOfUser(userId) {
        return db_1.pool.query('SELECT * FROM posts WHERE user_id = $1 ORDER BY views_count DESC LIMIT 10;', [userId]);
    }
    static fetchUserPostsInfo(userId) {
        return db_1.pool.query(`SELECT COUNT(*) AS posts_number, DATE_TRUNC('day', created_at) AS date  FROM posts WHERE user_id = $1
      GROUP BY DATE_TRUNC('day', created_at);`, [userId]);
    }
    static findById(id) {
        return db_1.pool.query('SELECT * FROM posts WHERE id = $1;', [id]);
    }
    static updateById(id, title, content, userId) {
        return db_1.pool.query('UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4;', [title, content, id, userId]);
    }
    static deleteById(id) {
        return db_1.pool.query('DELETE FROM posts WHERE id = $1;', [id]);
    }
    static incrementViewsCount(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.pool.query('SELECT * FROM posts_views WHERE post_id = $1 AND user_id = $2;', [postId, userId]);
            if (response.rowCount === 0) {
                yield db_1.pool.query(`INSERT INTO posts_views
              (post_id, user_id)
            VALUES
              ($1, $2);`, [postId, userId]);
                yield db_1.pool.query('UPDATE posts SET views_count = views_count + 1 WHERE id = $1;', [postId]);
            }
        });
    }
    static changeLikesCount(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield db_1.pool.query('SELECT * FROM posts_likes WHERE post_id = $1 AND user_id = $2;', [postId, userId]);
                if (response.rowCount === 0) {
                    yield db_1.pool.query(`INSERT INTO posts_likes
                  (post_id, user_id)
                VALUES
                  ($1, $2);`, [postId, userId]);
                    const result = yield db_1.pool.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1 RETURNING likes_count;', [postId]);
                    console.log(result);
                    return Promise.resolve({
                        message: 'Like added!',
                        likesCount: result.rows[0].likes_count
                    });
                }
                else {
                    yield db_1.pool.query(`DELETE FROM posts_likes WHERE post_id = $1 AND user_id = $2`, [postId, userId]);
                    const result = yield db_1.pool.query('UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1 RETURNING likes_count;', [postId]);
                    return Promise.resolve({
                        message: 'Like removed!',
                        likesCount: result.rows[0].likes_count
                    });
                }
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
}
exports.default = Post;

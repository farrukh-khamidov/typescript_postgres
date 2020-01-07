"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db/db");
class User {
    constructor(firstName, lastName, userName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.email = email;
        this.password = password;
    }
    save() {
        return db_1.pool.query(`INSERT INTO users
      (firstname, lastname, username, password, email)
    VALUES
      ($1, $2, $3, $4, $5);`, [this.firstName, this.lastName, this.userName, this.password, this.email]);
    }
    static findByEmail(email) {
        return db_1.pool.query('SELECT * FROM users WHERE email = $1;', [email]);
    }
}
exports.User = User;

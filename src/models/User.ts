import { pool } from '../db/db';

export class User {
  private firstName: string;
  private lastName: string;
  private userName: string;
  private email: string;
  private password: string;

  constructor(
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.email = email;
    this.password = password;
  }

  save() {
    return pool.query(
      `INSERT INTO users
      (firstname, lastname, username, password, email)
    VALUES
      ($1, $2, $3, $4, $5);`,
      [this.firstName, this.lastName, this.userName, this.password, this.email]
    );
  }

  static findByEmail(email: string) {
    return pool.query('SELECT * FROM users WHERE email = $1;', [email]);
  }
}

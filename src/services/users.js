import pool from "../config/db.js";
import argon from "argon2";
import { InternalServerError, NotFoundError } from "../utils/error.js";

class UserServices {
  async getAdmins(next) {
    try {
      const role = await pool.query(`
      SELECT users.id, fullname, phone, photo,
            users.created_at, users.status,
            roles.name AS role
      FROM users
      INNER JOIN roles ON roles.id = users.role_id
      WHERE roles.name = 'admin'
    `);

      return {
        status: 200,
        data: role.rows,
      };
    } catch (error) {
      return next(new InternalServerError(500, error.message));
    }
  }
  async createAdmin(req) {
    try {
      const { fullname, phone, password, role_id } = req.body;

      const existUser = await pool.query(
        "SELECT * FROM users WHERE phone = $1",
        [phone]
      );

      if (existUser.rows.length) {
        return {
          status: 409,
          message: "User already exists",
        };
      }

      const existRole = await pool.query("SELECT * FROM roles WHERE id = $1", [
        role_id,
      ]);

      if (!existRole.rows.length) {
        return {
          status: 404,
          message: "Role not found with this id",
        };
      }

      const hashPassword = await argon.hash(password);

      await pool.query(
        `INSERT INTO users(fullname, phone, password, role_id)
      VALUES($1, $2, $3, $4)`,
        [fullname, phone, hashPassword, role_id]
      );

      return {
        status: 201,
        message: "User created!",
      };
    } catch (error) {}
  }


  async createTeacher(req) {
    
  }
  async deleteUser(req, next) {
    try {
      const { userId } = req.params;

      const existUser = await pool.query("SELECT * FROM users WHERE id=$1", [
        userId,
      ]);

      if (!existUser.rows.length) {
        return next(new NotFoundError(404, "User not found with this id"));
      }

      await pool.query("DELETE FROM users WHERE id=$1", [userId]);

      return {
        status: 200,
        message: "User deleted",
      };
    } catch (error) {
      return next(new InternalServerError(500, error.message));
    }
  }
}
const userService = new UserServices();

export default userService;

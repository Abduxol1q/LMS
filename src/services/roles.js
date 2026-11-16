import pool from "../config/db.js";
import { ConflictError, InternalServerError } from "../utils/error.js";

class RoleService {
  async getRoles() {
    let roles = await pool.query("select * from roles");
    return {
      status: 200,
      data: roles.rows,
    };
  } 
  async createRole(req,next) {
    try {
      const { name } = req.body;

      const existRole = await pool.query(
        "SELECT * FROM roles WHERE name = $1",
        [name]
      );

      if (existRole.rows.length) {
        return next(new ConflictError(409, "role already exist"));
      }

      await pool.query("INSERT INTO roles(name) VALUES($1)", [name]);

      return {
        status: 201,
        message: "Role created!",
      };
    } catch (error) {
    
    }
  }
}
const roleService = new RoleService();
export default roleService;

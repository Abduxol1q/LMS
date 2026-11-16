import roleService from "../services/roles.js";

class RoleController {

  async getAllRoles(req, res) {
    let resData = await roleService.getRoles();

    return res.status(resData.status).json(resData);
  }
  async createRole(req, res, next) {
    try {
      const resData = await roleService.createRole(req, next);

      if (!resData) {
        return;
      }

      return res.status(resData.status).json(resData);
    } catch (error) {
      return next(error);
    }
  }

} const roleController = new RoleController();

export default roleController;

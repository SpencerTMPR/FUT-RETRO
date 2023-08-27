
import { Router } from "express";
import authController from "../controllers/auth.controller";
import roleController from "../controllers/role.controller";

class RolesRoutes {

      router = Router();

      constructor() {
             
            this.initRoutes();
            
      };

      initRoutes = () => {

            this.router.get('/', authController.verifyToken, roleController.getRoles)
                  .post('/', authController.verifyToken, roleController.createRole)
                  .patch('/:id', authController.verifyToken, roleController.updateRole)
                  .delete('/:id', authController.verifyToken, roleController.deleteRole);

      };

}

export default new RolesRoutes();

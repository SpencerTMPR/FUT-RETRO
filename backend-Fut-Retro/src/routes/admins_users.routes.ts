
import { Router } from "express";
import userController from '../controllers/user.controller';
import authController from '../controllers/auth.controller'

class AdminsUsersRoutes {

      router = Router();

      constructor() {

            this.initRoutes();

      };

      initRoutes = () => {

            this.router.get('/', authController.verifyToken, userController.getUsers)
                  .get('/motorists', authController.verifyToken, userController.getMotoristUsers)
                  .get('/motorists/approved', authController.verifyToken, userController.getMotoristUsersByApproved)
                  .post('/register_admin', authController.verifyToken, userController.register_admin)
                  .patch('/motorists/approved', authController.verifyToken, userController.approvedMotorist);
      
      };

}

export default new AdminsUsersRoutes();

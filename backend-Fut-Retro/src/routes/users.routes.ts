
import { Router } from "express";
import userController from '../controllers/user.controller';
import authController from '../controllers/auth.controller'

class UsersRoutes {

      router = Router();

      constructor() {

            this.initRoutes();

      };

      initRoutes = () => {

            this.router.get('/profile', authController.verifyToken, userController.profile)
                  .patch('/update', authController.verifyToken, userController.updateUser)
                  .delete('/delete', authController.verifyToken, userController.deleteUser);
      
      };

}

export default new UsersRoutes();

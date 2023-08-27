
import { Router } from "express";
import authController from "../controllers/auth.controller";

class AuthRoutes {

      router = Router();

      constructor() {

            this.initRoutes();

      };

      initRoutes = () => {

            this.router.get('/ping', authController.ping)
                  .post('/signup_client', authController.signup_client)
                  .post('/signup_motorist', authController.signup_motorist)
                  .post('/signin', authController.signin)
                  .patch('/change_password', authController.verifyToken, authController.changePassword)
                  .delete('/signout', authController.signout);
      
      };

}

export default new AuthRoutes();

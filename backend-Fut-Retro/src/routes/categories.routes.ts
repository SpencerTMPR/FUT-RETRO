
import { Router } from "express";
import authController from "../controllers/auth.controller";
import companyController from '../controllers/company.controller';
import categoryController from "../controllers/category.controller";

class CategoriesRoutes {

      router = Router();
      
      constructor() {
                      
            this.initRoutes();
                  
      };
      
      initRoutes = () => {
      
            this.router.get('/', categoryController.getCategories)
                  .post('/', authController.verifyToken, categoryController.createCategory)
                  .patch('/:id', authController.verifyToken, categoryController.updateCategory)
                  .delete('/:id', authController.verifyToken, categoryController.deleteCategory);       
      
      };

}

export default new CategoriesRoutes();

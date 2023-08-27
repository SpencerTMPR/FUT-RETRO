
import { Router } from "express";
import authController from "../controllers/auth.controller";
import productController from '../controllers/product.controller';

class ProductsRoutes {

      router = Router();
      
      constructor() {
                      
            this.initRoutes();
                  
      };
      
      initRoutes = () => {
      
            this.router.get('/', productController.getProducts)
                  .get('/company/:id', productController.getProductsByCompany)
                  .post('/', authController.verifyToken, productController.createProduct)
                  .patch('/:id', authController.verifyToken, productController.updateProduct)
                  .delete('/:id', authController.verifyToken, productController.deleteProduct);       
      
      };

}

export default new ProductsRoutes();


import { Router } from "express";
import authController from "../controllers/auth.controller";
import companyController from '../controllers/company.controller';

class CompaniesRoutes {

      router = Router();
      
      constructor() {
                      
            this.initRoutes();
                  
      };
      
      initRoutes = () => {
      
            this.router.get('/', companyController.getCompanies)
                  .get('/category/:id', companyController.getCompaniesByCategory)
                  .post('/', authController.verifyToken, companyController.createCompany)
                  .patch('/:id', authController.verifyToken, companyController.updateCompany)
                  .delete('/:id', authController.verifyToken, companyController.deleteCompany);       
      
      };

}

export default new CompaniesRoutes();

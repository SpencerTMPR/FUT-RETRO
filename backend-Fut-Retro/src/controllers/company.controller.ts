
import { Request, Response } from "express"
import Company from '../models/company.model';
import Product from '../models/product.model';
import companiesService from '../services/companies.service';
import authController from '../controllers/auth.controller';
import { plainToClass } from "class-transformer";
import { CreateCompanyDto } from "../dtos/create_company.dto";
import { ResponseDto } from "../common/dto/response.dto";
import { UpdateCompanyDto } from "../dtos/update_company.dto";
import productsService from "../services/products.service";

class CompanyController {

    public getCompanies = async (req: Request, res: Response) => {

        try {

            const companies = await companiesService.getCompanies();

            res.status(200).send(companies);
            
        } catch (error) {

            if (error instanceof Error) {
                                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
                    
        }

    };

    public getCompaniesByCategory = async (req: Request, res: Response) => {

        try {

            const { id } = req.params;

            const companies = await companiesService.getCompaniesByCategory(id);

            res.status(companies.code!).send(companies);
            
        } catch (error) {

            if (error instanceof Error) {
                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    public createCompany = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to create companies!'}));

            const payload = req.body;

            const createCompanyDto = plainToClass(CreateCompanyDto, payload);
            const validatedCompany = await companiesService.validationAddCompany(createCompanyDto);

            const newCompany = await Company.create({
                ...validatedCompany,
                _id_category: validatedCompany.category
            });

            const response: ResponseDto = {
                code: 201,
                message: 'New company created successfully.',
                results: newCompany
            };

            res.status(response.code!).send(response);
            
        } catch (error) {

            if (error instanceof Error) {
                                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    // Admin
    public updateCompany = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to update companies!'}));
        
            const { id } = req.params;

            const company = await companiesService.getCompanyById(id);

            const updateCompanyDto = plainToClass(UpdateCompanyDto, req.body);
            const validatedCompany = await companiesService.validationUpdateInfoCompany(updateCompanyDto);

            company.set({ ...validatedCompany });
            await company.save();

            const response: ResponseDto = {
                code: 200,
                message: 'Company updated successfully.',
                results: {
                    _id: company._id,
                    ...validatedCompany
                }
            };

            res.status(response.code!).send(response);
            
        } catch (error) {

            if (error instanceof Error) {
                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    // Admin
    public deleteCompany = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to delete companies!'}));
        
            const { id } = req.params;

            const company = await companiesService.getCompanyById(id);

            await Company.findByIdAndDelete({ _id: company._id });
            await Product.deleteMany({ _id_company: company._id });

            const response: ResponseDto = {
                code: 200,
                message: `The company with email '${company.email}' deleted successfully.`,
                results: company
            };

            res.status(response.code!).send(response);
            
        } catch (error) {

            if (error instanceof Error) {
                
                console.log(error);

                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

}

export default new CompanyController();

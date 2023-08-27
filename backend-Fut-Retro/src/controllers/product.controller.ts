
import { Request, Response } from "express"
import Product from '../models/product.model';
import Company from '../models/company.model';
import companiesService from '../services/companies.service';
import authController from '../controllers/auth.controller';
import { plainToClass } from "class-transformer";
import { ResponseDto } from "../common/dto/response.dto";
import { CreateProductDto } from "../dtos/create_product.dto";
import productsService from "../services/products.service";
import { UpdateProductDto } from "../dtos/update_product.dto";

class ProductController {

    public getProducts = async (req: Request, res: Response) => {

        try {

            const products = await productsService.getProducts();

            res.status(products.code!).send(products);
            
        } catch (error) {

            if (error instanceof Error) {
                                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
                    
        }

    };

    public getProductsByCompany = async (req: Request, res: Response) => {

        try {

            const { id } = req.params
            const company = await companiesService.getCompanyById(id);

            const products = await productsService.getProductsByNameCompany(company.name);

            res.status(200).send(products);
            
        } catch (error) {

            if (error instanceof Error) {
                                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
                    
        }

    };

    public createProduct = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to create products!'}));

            const payload = req.body;

            const createProductDto = plainToClass(CreateProductDto, payload);
            const validatedProduct = await productsService.validationAddProduct(createProductDto);

            const newProduct = await Product.create({
                ...validatedProduct,
            });

            const response: ResponseDto = {
                code: 201,
                message: 'New product created successfully.',
                results: newProduct
            }
            
            res.status(response.code!).send(response);
            
        } catch (error) {

            if (error instanceof Error) {
                                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    public updateProduct = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to update products!'}));
        
            const { id } = req.params;

            const product = await productsService.getProductById(id);

            const updateProductDto = plainToClass(UpdateProductDto, req.body);
            const validatedProduct = await productsService.validationUpdateInfoProduct(updateProductDto, id);

            product.set({ ...validatedProduct });
            await product.save();

            const response: ResponseDto = {
                code: 200,
                message: 'Product updated successfully.',
                results: {
                    _id: product._id,
                    ...validatedProduct
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

    public deleteProduct = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to delete products!'}));
        
            const { id } = req.params;

            const product = await productsService.getProductById(id);
            const companyName = await companiesService.getCompanyById(product._id_company.toString()).then(data => data.name);

            await Product.findByIdAndDelete({ _id: product._id });

            const response: ResponseDto = {
                code: 200,
                message: `The product with name '${product.name}' in company '${companyName}' deleted successfully.`,
                results: product
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

}

export default new ProductController();

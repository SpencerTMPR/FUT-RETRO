
import generalUtils from '../common/utils/general.utils';
import Category from '../models/category.model';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { ResponseDto } from '../common/dto/response.dto';
import authController from './auth.controller';
import categoriesService from '../services/categories.service';
import { CreateCategoryDto } from '../dtos/create_category.dto';
import { UpdateCategoryDto } from '../dtos/update_category.dto';

class CategoryController {

    private roles = [ { name: 'comidas', img: 'https://www.koreanbapsang.com/wp-content/uploads/2018/09/DSC4637-4.jpg' }, 
                      { name: 'jardinería', img: 'https://www.catalunyaplants.com/wp-content/uploads/2017/01/consejos-de-seguridad-y-salud-en-jardineria.jpg' }, 
                      { name: 'ropa mujer', img: 'https://img.i-scmp.com/cdn-cgi/image/fit=contain,width=425,format=auto/sites/default/files/styles/768x768/public/d8/images/canvas/2023/01/30/709db5a5-a9b2-4269-9e29-ea89de01cfdf_3e530a52.jpg?itok=atSa-iNy&v=1675067106' }, 
                      { name: 'mascotas', img: 'https://www.bbva.ch/wp-content/uploads/2022/05/recurso_mascotas.jpg' }, 
                      { name: 'hogar', img: 'https://media.admagazine.com/photos/618a668ab94700461d6213eb/master/w_1600%2Cc_limit/68287.jpg' }, 
                      { name: 'deportes', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7Uh6LzKZwPASjvI92cU03xGk7Fg40zY0fPAR3ZZtoatVVJ9_IGocYePj51RihE_-QUW8&usqp=CAU' }, 
                      { name: 'ropa hombre', img: 'https://cloudfront-us-east-1.images.arcpublishing.com/gruporepublica/WVHOD6AUYRFAHOSAWQFED7T25Q.jpg' }, 
                      { name: 'electrónica', img: 'https://img.freepik.com/vector-premium/dispositivos-dispositivos-electronicos-realistas-isometria-vector-ilustracion-isometrica-dispositivos_480270-27.jpg' } ];

    public getCategories = async (req: Request, res: Response) => {

        try {

            const categories = await categoriesService.getCategories();

            res.status(categories.code!).send(categories);
            
        } catch (error) {

            if (error instanceof Error) {
                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    public createCategory = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to create categories!'}));

            const payload = req.body;

            const createCategoryDto = plainToClass(CreateCategoryDto, payload);
            const validatedCategory = await categoriesService.validationAddCategory(createCategoryDto);

            const newCategory = await Category.create({
                ...validatedCategory
            });

            const response: ResponseDto = {
                code: 201,
                message: 'New category created successfully.',
                results: newCategory
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

    public updateCategory = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to update categories!'}));
        
            const { id } = req.params;

            const category = await categoriesService.getCategoryById(id);

            const updateCategoryDto = plainToClass(UpdateCategoryDto, req.body);
            const validatedCategory = await categoriesService.validationUpdateInfoCategory(updateCategoryDto);

            category.set({ ...validatedCategory });
            await category.save();

            const response: ResponseDto = {
                code: 200,
                message: 'Category updated successfully.',
                results: {
                    _id: category._id,
                    ...validatedCategory
                }
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

    public deleteCategory = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to delete categories!'}));
        
            const { id } = req.params;

            const category = await categoriesService.getCategoryById(id);

            await Category.findByIdAndDelete({ _id: category._id });

            const response: ResponseDto = {
                code: 200,
                message: `The category '${category.name}' deleted successfully.`,
                results: {
                    ...category
                }
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

    public insertCategories = async () => {

        try {

            const countCategories = await Category.countDocuments();

            if (countCategories === 0) {

                this.roles.map(async (category) => {
                    
                    await Category.create({
                        name: generalUtils.formattingWords(category.name),
                        img: category.img
                    });

                });

            }
            
        } catch (error) {

            (error instanceof Error) ? console.log(error.message) :  console.log(String(error));
            
        }

    };

}

export default new CategoryController();

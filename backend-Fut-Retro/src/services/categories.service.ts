
// Categorys service
import { ResponseDto } from "../common/dto/response.dto";
import generalUtils from "../common/utils/general.utils";
import { CreateCategoryDto } from "../dtos/create_category.dto";
import { UpdateCategoryDto } from "../dtos/update_category.dto";
import Category from "../models/category.model";
import Company from "../models/company.model";

class CategoriesService {

    public getCategories = async (): Promise<ResponseDto> => {

        const searchAllCategories = await Category.find();

        if (searchAllCategories.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: 'There are not categories added!' }));

        let categories: any = [];

        for (const category of searchAllCategories) {

            const countCategories = await Company.find({ _id_category: category._id });

            categories.push({
                _id: category._id,
                name: category.name,
                img: category.img,
                count_companies: countCategories.length
            });

        };

        return {
            code: 200,
            message: 'List of all categorys.',
            count: searchAllCategories.length,
            results: categories 
        };

    };

    public getCategoryById = async (_id: string) => {

        if (!(generalUtils.validate_id(_id))) throw new Error(JSON.stringify({ code: 400, message: `_id '${_id}' is not valid!` }));

        const category = await Category.findById(_id);

        if (category === null) 
            throw new Error(JSON.stringify({ code: 404, message: 'Category is not exists! The following categories exist...', results: (await Category.find({ order: [['id', 'ASC']] })) }));

        return category;

    };

    public getCategoryByName = async (name: string) => {

        name = generalUtils.formattingWords(name);

        const category = await Category.findOne({ name });

        return category;

    };

    public validationAddCategory = async (category: CreateCategoryDto): Promise<CreateCategoryDto> => {

        const errors = await generalUtils.errorsFromValidate(category);

        if (errors !== undefined) throw new Error(JSON.stringify(errors));

        category.name = generalUtils.formattingWords(category.name);

        if ((await this.getCategoryByName(category.name)) !== null) 
            throw new Error(JSON.stringify({ code: 400, message: 'Category already exists!' }));

        return category;

    };

    public validationUpdateInfoCategory = async (category: UpdateCategoryDto): Promise<UpdateCategoryDto> => {
        
        if (category.name !== undefined) category.name = generalUtils.formattingWords(category.name);

        const errors = await generalUtils.errorsFromValidate(category);

        if (errors !== undefined) throw new Error(JSON.stringify(errors));
        
        if ((await this.getCategoryByName(category.name)) !== null) 
            throw new Error(JSON.stringify({ code: 400, message: 'Category already exists!' }));
        
        return category;

    };

}

export default new CategoriesService();

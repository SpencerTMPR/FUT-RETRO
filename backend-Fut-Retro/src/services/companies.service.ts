
import { CreateCompanyDto } from '../dtos/create_company.dto';
import Company from '../models/company.model';
import Category from '../models/category.model';
import generalUtils from '../common/utils/general.utils';
import { UpdateCompanyDto } from '../dtos/update_company.dto';
import categoriesService from './categories.service';

class CompaniesService {

    public getCompanies = async () => {

        const companies = await Company.find();
        
        if (companies.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not companies added!' }));

        return {
            code: 200,
            count: companies.length,
            results: companies
        };

    };

    public getCompaniesByCategory = async (_id: string) => {

        if (!(generalUtils.validate_id(_id))) 
            throw new Error(JSON.stringify({ code: 400, message: `_id '${_id}' is not valid!` }));

        const category = await Category.findOne({ _id });
        
        if (category === null)
            throw new Error(JSON.stringify({ code: 404, message: 'Category is not exists! The following categories exist...', results: (await Category.find({ }, { _id: 0 }).sort({ name: 1 })).map(role => role.name) }));

        const allCompaniesInThisCategory = await Company.find({ _id_category: _id });

        if (allCompaniesInThisCategory.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: `There are not companies added in the category '${category.name}'!` }));

        return {
            code: 200,
            count: allCompaniesInThisCategory.length,
            message: `Companies in the category '${category.name}'.`,
            results: allCompaniesInThisCategory
        };

    };

    public searchCompanyByName = async (name: string) => {

        name = generalUtils.formattingWords(name);

        const company = await Company.findOne({ name });

        return company;

    };

    public searchCompanyByEmail= async (email: string) => {

        const company = await Company.findOne({ email });
  
        return company;

    };

    public getCompanyById = async (_id: string) => {

        if (!(generalUtils.validate_id(_id))) 
            throw new Error(JSON.stringify({ code: 400, message: `_id '${_id}' is not valid!` }));

        const company = await Company.findById(_id);

        if (company === null) 
            throw new Error(JSON.stringify({ code: 404, message: 'Company is not exists! The following companies exist...', results: (await Company.find()) }));

        return company;

    };

    public validationAddCompany = async (company: CreateCompanyDto): Promise<CreateCompanyDto> => {

        const errors = await generalUtils.errorsFromValidate(company);

        if (errors !== undefined) throw new Error(JSON.stringify(errors));

        company.name = generalUtils.formattingWords(company.name);
        company.category = generalUtils.formattingWords(company.category)

        if (await this.searchCompanyByName(company.name)) 
            throw new Error(JSON.stringify({ code: 400, message: `Company name '${company.name}' already exists!` }));

        const category = await categoriesService.getCategoryByName(company.category);

        if (!category) 
            throw new Error(JSON.stringify({ code: 404, message: 'Category is not exists! The following categories exist...', results: (await Category.find({ }, { _id: 0 }).sort({ name: 1 })).map(role => role.name) }));
        
        company.category = category._id;

        return company;

    };

    public validationUpdateInfoCompany = async (company: UpdateCompanyDto): Promise<UpdateCompanyDto> => {
        
        if (company.name !== undefined) company.name = generalUtils.formattingWords(company.name);

        const errors = await generalUtils.errorsFromValidate(company);

        if (errors !== undefined) throw new Error(JSON.stringify(errors));

        if (company.name !== undefined)
            if (await this.searchCompanyByName(company.name!)) 
                throw new Error(JSON.stringify({ code: 400, message: `Company with this name '${company.name}' already exists.` }));

        if (company.category !== undefined)
            if (!(await categoriesService.getCategoryByName(company.category))) 
                throw new Error(JSON.stringify({ code: 404, message: 'Category is not exists! The following categories exist...', results: (await Category.find({ }, { _id: 0 }).sort({ name: 1 })).map(cat => cat.name) }));
        
        return company;

    };

}

export default new CompaniesService();

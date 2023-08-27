
import { CreateProductDto } from '../dtos/create_product.dto';
import Product from '../models/product.model';
import generalUtils from '../common/utils/general.utils';
import companiesService from './companies.service';
import { UpdateProductDto } from '../dtos/update_product.dto';

interface IProducts {
    _id: string,
    name: string,
    img: string,
    price: number,
    company: {}
}

class ProductsService {

    public getProducts = async () => {

        const products = await Product.find().populate('_id_company', [ '_id', 'name', 'phone', 'email' ]);
        
        if (products.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: 'There are not products added!' }));
        
        const filteredProducts = products.map(product => {
            
            return {
                _id: product._id,
                name: product.name,
                img: product.price,
                price: product.price,
                company: product._id_company
            }

        });

        return {
            code: 200,
            count: products.length,
            results: filteredProducts
        };

    };
    
    public getProductsByEmailCompany = async (email_company: string) => {

        const company = await companiesService.searchCompanyByEmail(email_company);

        if (company === null) 
            throw new Error(JSON.stringify({ code: 404, message: 'Company is not exists!' }));
        
        const _id_company = company._id;
        
        const products = await Product.find({ _id_company });

        if (products.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: 'There are not products added!' }));

        return {
            code: 200,
            count: products.length,
            results: products
        };

    };

    public getProductsByNameCompany = async (name_company: string) => {

        const company = await companiesService.searchCompanyByName(name_company);

        if (company === null) 
            throw new Error(JSON.stringify({ code: 404, message: 'Company is not exists!' }));
        
        const _id_company = company._id;
        
        const products = await Product.find({ _id_company });

        if (products.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: 'There are not products added!' }));

        return {
            code: 200,
            count: products.length,
            results: products
        };

    };

    public searchProductByName = async (name: string) => {

        const product = await Product.findOne({ name });

        return product;

    };

    public searchProductByEmail= async (email: string) => {

        const product = await Product.findOne({ email });
 
        return product;

    };

    public getProductById = async (_id: string) => {

        if (!(generalUtils.validate_id(_id))) 
            throw new Error(JSON.stringify({ code: 400, message: `_id '${_id}' is not valid!` }));

        const product = await Product.findById(_id);

        if (product === null) 
            throw new Error(JSON.stringify({ code: 404, message: 'Product is not exists!' }));

        return product;

    };

    public validationAddProduct = async (product: CreateProductDto): Promise<CreateProductDto> => {

        const errors = await generalUtils.errorsFromValidate(product);

        if (errors !== undefined) throw new Error(JSON.stringify(errors));

        product.name = generalUtils.formattingWords(product.name);

        const company = await companiesService.searchCompanyByEmail(product.email_company);

        if (!company) 
            throw new Error(JSON.stringify({ code: 400, message: `Company email '${product.email_company}' not exists!` }));
        
        product._id_company = company._id;

        return product;

    };

    public validationUpdateInfoProduct = async (product: UpdateProductDto, _id: string): Promise<UpdateProductDto> => {

        if (product.name !== undefined) product.name = generalUtils.formattingWords(product.name);

        const errors = await generalUtils.errorsFromValidate(product);

        if (errors !== undefined) throw new Error(JSON.stringify(errors));

        if (product.email_company !== undefined) {

            const company = await companiesService.searchCompanyByEmail(product.email_company);

            if (!company) 
                throw new Error(JSON.stringify({ code: 400, message: `Company email '${product.email_company}' not exists!` }));
               
            product._id_company = company._id;

        }

        return product;

    };

}

export default new ProductsService();

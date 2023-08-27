
// Bills service
import { ResponseDto } from "../common/dto/response.dto";
import generalUtils from "../common/utils/general.utils";
import { CreateBillDto } from "../dtos/create_bill.dto";
import productsService from "./products.service";
import usersService from "./users.service";
import Bill from '../models/bill.model';
import Product from '../models/product.model';

interface IFinalSale {
    subtotal: number,
    products: any[]
}

class BillsServices {

    public getAllBills = async (): Promise<ResponseDto> => {

        const searchAllBills = await Bill.find();

        if (searchAllBills.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: 'There are not bills added!' }));

        return {
            code: 200,
            message: 'List of all bills.',
            count: searchAllBills.length,
            results: searchAllBills 
        };

    };

    public getBillById = async (_id: string) => {

        const bill = await Bill.findOne({ _id });

        if (bill === null) throw new Error(JSON.stringify({ code: 404, message: 'Bill is not exists!' }));

        return bill;

    };

    public getBillsByEmailClient = async (email: string): Promise<ResponseDto> => {
        
        const user = await usersService.searchUserByEmail(email);

        if (!user) 
            throw new Error(JSON.stringify({ code: 404, message: 'User is not exists!' }));

        const billsClient = await Bill.find({ _id_user: user._id });
               
        if (billsClient.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: 'You have not made any purchase!' }));

        return {
            code: 200,
            message: 'These are your purchases.',
            count: billsClient.length,
            results: billsClient
        };

    };

    public validationAddBill = async (bill: CreateBillDto): Promise<CreateBillDto> => {

        const errors = await generalUtils.errorsFromValidate(bill);

        if (errors !== undefined) throw new Error(JSON.stringify(errors));

        await usersService.searchUserById(bill._id_user);

        return bill;

    };

    public validationProductsBill = async (products: any): Promise<IFinalSale> => {

        let finalSale: IFinalSale = {
            subtotal: 0,
            products: []
        };

        const searchAllStoresProducts = await productsService.getProducts();

        for (const product of products.products) {

            const existsProduct = await Product.findById(product._id_product);

            if (!existsProduct) 
                throw new Error(JSON.stringify({ code: 404, message: `The product '${product._id_product}' is not exists.'. The following products are available...`, results: searchAllStoresProducts }));
            
            finalSale.subtotal += product.units * existsProduct.price;
            finalSale.products.push({ 
                _id_product: product._id_product,
                price: existsProduct.price,
                units: product.units
            });

        }

        return finalSale;

    };

}

export default new BillsServices();

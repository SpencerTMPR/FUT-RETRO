
// Bills service
import { ResponseDto } from "../common/dto/response.dto";
import generalUtils from "../common/utils/general.utils";
import { CreateBillDto } from "../dtos/create_bill.dto";
import productsService from "./products.service";
import usersService from "./users.service";
import Order from '../models/order.model';
import Product from '../models/product.model';

class OrdersServices {

    public getAllOrders = async (): Promise<ResponseDto> => {

        const searchAllOrders = await Order.find();

        if (searchAllOrders.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: 'There are not orders added!' }));

        return {
            code: 200,
            message: 'List of all orders.',
            count: searchAllOrders.length,
            results: searchAllOrders 
        };

    };

    public getOrdersByState = async (state: string): Promise<ResponseDto> => {

        state = generalUtils.formattingWords(state);

        const searchAllOrders = await Order.find({ state });

        if (searchAllOrders.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: 'There are not orders added!' }));

        return {
            code: 200,
            message: `List of all orders '${state}'.`,
            count: searchAllOrders.length,
            results: searchAllOrders 
        };

    };

    public getOrdersByStateAndByMotorist = async (state: string, _id_motorist: string): Promise<ResponseDto> => {

        state = generalUtils.formattingWords(state);

        if (!(generalUtils.validate_id(_id_motorist))) 
            throw new Error(JSON.stringify({ code: 400, message: `_id_motorist '${_id_motorist}' is not valid!` }));

        const searchOrdersDelivered = await Order.find({ state, _id_motorist });

        if (searchOrdersDelivered.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: 'There are not orders delivered added!' }));

        return {
            code: 200,
            message: `List of all orders '${state}'.`,
            count: searchOrdersDelivered.length,
            results: searchOrdersDelivered 
        };

    };

    public getOrderById = async (_id: string) => {

        if (!(generalUtils.validate_id(_id))) 
            throw new Error(JSON.stringify({ code: 400, message: `_id_order '${_id}' is not valid!` }));

        const order = await Order.findOne({ _id });

        if (order === null) 
            throw new Error(JSON.stringify({ code: 404, message: 'Order is not exists!' }));

        return order;

    };

    public validationAddBill = async (bill: CreateBillDto): Promise<CreateBillDto> => {

        const errors = await generalUtils.errorsFromValidate(bill);

        if (errors !== undefined) throw new Error(JSON.stringify(errors));

        await usersService.searchUserById(bill._id_user);

        return bill;

    };

    public validationProductsBill = async (products: any): Promise<any> => {

        let finalSale: any = {
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

export default new OrdersServices();


import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { ResponseDto } from '../common/dto/response.dto';
import { CreateBillDto } from '../dtos/create_bill.dto';
import Bill, { IBillCreate } from '../models/bill.model';
import billsService from '../services/bills.service';
import usersService from '../services/users.service';
import authController from './auth.controller';
import { IOrderCreate } from '../models/order.model';
import Order from '../models/order.model';

class BillController {

    // Admin
    public getAllBills = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list the bills!'}));

            const bills = await billsService.getAllBills();

            res.status(bills.code!).send(bills);
            
        } catch (error) {

            if (error instanceof Error) {
                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    public getBills = async (req: Request, res: Response) => {

        try {

            const { email, role } = authController.token;

            if (role !== 'Client') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list the bills!'}));

            const billsPurchase = await billsService.getBillsByEmailClient(email);

            return res.status(billsPurchase.code!).send(billsPurchase);

        } catch (error) {

            if (error instanceof Error) {
                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    public createBill = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Client') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to create bills!'}));

            const payload = req.body;

            const createBillDto = plainToClass(CreateBillDto, payload);
        
            createBillDto._id_user = await usersService.searchUserByEmail(authController.token.email).then(data => data?._id.toString());
            createBillDto.date = new Date().toLocaleString();

            const validatedBill = await billsService.validationAddBill(createBillDto);
            const finalSale = await billsService.validationProductsBill(payload);

            const motorist_commissions: number = 60;
            const administration_commissions: number = 20;

            validatedBill.commissions = {
                motorist_commissions,
                administration_commissions,
                total_commissions: motorist_commissions + administration_commissions
            };

            const isv = finalSale.subtotal * 0.15;
            const total = finalSale.subtotal + isv + validatedBill.commissions.total_commissions;

            const createBillDetail: IBillCreate = {
                date: validatedBill.date,
                list_products: payload.products,
                subtotal: finalSale.subtotal,
                isv,
                commissions: validatedBill.commissions ,
                total,
                _id_user: validatedBill._id_user
            };

            const newBill = await Bill.create({
                ...createBillDetail
            });

            const createOrder: IOrderCreate = {
                date: newBill.date,
                list_products: newBill.list_products,
                address: validatedBill.address,
                _id_client: newBill._id_user,
                state: 'Pendiente'
            };

            const newOrder = await Order.create({
                ...createOrder
            });

            const response: ResponseDto = {
                code: 201,
                message: 'New bill created successfully.',
                results: newBill
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

export default new BillController();

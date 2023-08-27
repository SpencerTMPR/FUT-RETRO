
import { Request, Response } from 'express';
import Order from '../models/order.model';
import ordersService from '../services/orders.service';
import authController from './auth.controller';
import usersService from '../services/users.service';
import { ResponseDto } from '../common/dto/response.dto';
import generalUtils from '../common/utils/general.utils';

class OrderController {

    // states: Pendiente, En Proceso y Completado
    private states = [ 'Pendiente', 'En Proceso', 'Completado' ];

    // Admin
    public getAllOrders = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list all orders!'}));

            const orders = await ordersService.getAllOrders();

            res.status(orders.code!).send(orders);
            
        } catch (error) {

            if (error instanceof Error) {
                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    // Admin
    public getAllOrdersInProcess = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list all orders in process!'}));

            const orders = await ordersService.getOrdersByState('En Proceso');

            res.status(orders.code!).send(orders);
            
        } catch (error) {

            if (error instanceof Error) {
                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    // Admin
    public getAllOrdersDelivered = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list all orders delivered!'}));

            const orders = await ordersService.getOrdersByState('Completado');

            res.status(orders.code!).send(orders);
            
        } catch (error) {

            if (error instanceof Error) {
                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    // Admin y Motorist
    public getOrdersAvailables = async (req: Request, res: Response) => {

        try {
            
            if (authController.token.role === 'Client') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list the orders availables!' }));

            const orders = await ordersService.getOrdersByState('Pendiente');

            res.status(orders.code!).send(orders);
            
        } catch (error) {

            if (error instanceof Error) {
                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    // Motorist
    public getOrdersDeliveredByMotorist = async (req: Request, res: Response) => {

        try {

            const user = await usersService.searchUserByEmail(authController.token.email);

            if (!user)
                throw new Error(JSON.stringify({ code: 404, message: 'User not exists!' }));
            
            if (authController.token.role === 'Client') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list the orders delivered!' }));

            const orders = await ordersService.getOrdersByStateAndByMotorist('completado', user._id.toString());

            res.status(orders.code!).send(orders);
            
        } catch (error) {

            if (error instanceof Error) {
                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    // Motorist
    public getOrdersInProcessByMotorist = async (req: Request, res: Response) => {

        try {

            const user = await usersService.searchUserByEmail(authController.token.email);

            if (!user)
                throw new Error(JSON.stringify({ code: 404, message: 'User not exists!' }));
            
            if (authController.token.role === 'Client') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list the orders in process!' }));

            const orders = await ordersService.getOrdersByStateAndByMotorist('en proceso', user._id.toString());

            res.status(orders.code!).send(orders);
            
        } catch (error) {

            if (error instanceof Error) {
                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };


    // Motorist
    public takeOrderMotorist = async (req: Request, res: Response) => {

        try {

            const { _id_order } = req.params;
            
            if (authController.token.role !== 'Motorist') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to take orders!' }));

            const user = await usersService.searchUserByEmail(authController.token.email);

            if (!user)
                throw new Error(JSON.stringify({ code: 404, message: 'User not exists!' }));

            if (!(user.approved))
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to take orders!' }));
    
            const order = await ordersService.getOrderById(_id_order);

            if (order.state !== 'Pendiente')
                throw new Error(JSON.stringify({ code: 400, message:'The order is no longer available.' }));

            order.set({
                state: 'En Proceso',
                _id_motorist: user._id
            });
            await order.save();

            const response: ResponseDto = {
                code: 200,
                message: `The order has been taken by a motorist with email '${user.email}'.`,
                results: order
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
    public assignOrderToMotorist = async (req: Request, res: Response) => {

        try {

            const payload = req.body;
            
            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to assign orders!' }));
        
            const order = await ordersService.getOrderById(payload._id_order);

            if (order.state !== 'Pendiente')
                throw new Error(JSON.stringify({ code: 400, message:'The order is no longer available.' }));
    
            const motorist = await usersService.searchUserByEmail(payload.email_motorist);

            if (!motorist)
                throw new Error(JSON.stringify({ code: 404, message: 'Motorist not exists!' }));

            if (!(motorist.approved))
                throw new Error(JSON.stringify({ code: 401, message: 'The motorist not have permission to take orders!' }));
                
            order.set({
                state: 'En Proceso',
                _id_motorist: motorist._id
            });
            await order.save();

            const response: ResponseDto = {
                code: 200,
                message: `The order has been taken by a motorist with email '${payload.email_motorist}'.`,
                results: order
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

    // Admin y Motorist
    public updateOrderState = async (req: Request, res: Response) => {

        try {

            const { _id_order } = req.body;
            let { state } = req.body;
            
            if (authController.token.role === 'Client') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to update orders!' }));
        
            const order = await ordersService.getOrderById(_id_order);

            state = generalUtils.formattingWords(state);

            if (!(this.states.includes(state)))
                throw new Error(JSON.stringify({ code: 400, message: `The state '${state} is invalid! The following states valid...`, results: this.states }));
                      
            order.set({
                state
            });
            await order.save();

            if (state === 'Pendiente') {
                
                order.set({
                    _id_motorist: null
                });
                await order.save();
            
            }

            const response: ResponseDto = {
                code: 200,
                message: `Order state updated successfully!.`,
                results: order
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

    public deleteOrder = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to delete orders!'}));
        
            const { id } = req.params;

            const order = await ordersService.getOrderById(id);

            await Order.findByIdAndDelete({ _id: order._id });

            const response: ResponseDto = {
                code: 200,
                message: `The order '${order._id}' deleted successfully.`,
                results: {
                    ...order
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

}

export default new OrderController();

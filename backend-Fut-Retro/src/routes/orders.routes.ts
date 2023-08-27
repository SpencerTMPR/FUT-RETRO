
import { Router } from "express";
import authController from "../controllers/auth.controller";
import billController from "../controllers/bill.controller";
import orderController from "../controllers/order.controller";

class OrdersRoutes {

    router = Router();

    constructor() {

        this.initRoutes();

    };

    initRoutes = () => {

        this.router.get('/', authController.verifyToken, orderController.getAllOrders)
                .get('/availables', authController.verifyToken, orderController.getOrdersAvailables)
                .get('/in_process', authController.verifyToken, orderController.getAllOrdersInProcess)
                .get('/delivered', authController.verifyToken, orderController.getAllOrdersDelivered)
                .get('/user', authController.verifyToken, orderController.getOrdersDeliveredByMotorist)
                .get('/user/in_process', authController.verifyToken, orderController.getOrdersInProcessByMotorist)
                .patch('/take_order/:_id_order', authController.verifyToken, orderController.takeOrderMotorist)
                .patch('/assign_order', authController.verifyToken, orderController.assignOrderToMotorist)
                .patch('/update_state', authController.verifyToken, orderController.updateOrderState);

    };

}

export default new OrdersRoutes();

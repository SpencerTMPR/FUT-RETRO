
import express, { json } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import cookieParser from 'cookie-parser';
import usersRoutes from './routes/users.routes';
import companiesRoutes from './routes/companies.routes';
import rolesRoutes from './routes/roles.routes';
import categoriesRoutes from './routes/categories.routes';
import productsRoutes from './routes/products.routes';
import billsRoutes from './routes/bills.routes';
import ordersRoutes from './routes/orders.routes';
import adminsUsersRoutes from './routes/admins_users.routes';

class App {

    express: express.Application;

    constructor() {

        this.express = express();

        this.middlewares();
        this.routes();

    };

    middlewares = () => {

        this.express.use(json());
        this.express.use(cors({
            origin: true,
            credentials: true
        }));
        this.express.use(cookieParser());

    };
    
    routes = () => {

        this.express.use('/api/auth', authRoutes.router)
                    .use('/api/user', usersRoutes.router)
                    .use('/api/users', adminsUsersRoutes.router)
                    .use('/api/roles', rolesRoutes.router)
                    .use('/api/categories', categoriesRoutes.router)
                    .use('/api/companies', companiesRoutes.router)
                    .use('/api/products', productsRoutes.router)
                    .use('/api/bills', billsRoutes.router)
                    .use('/api/orders', ordersRoutes.router);

    };

    listen = (PORT: number) => {

        this.express.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}, http://localhost:${PORT}/`);
        });

    };

}

export default new App();

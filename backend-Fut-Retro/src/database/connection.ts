
import mongoose from "mongoose";
import 'dotenv/config';
import roleController from '../controllers/role.controller';
import userController from "../controllers/user.controller";
import categoryController from "../controllers/category.controller";

mongoose.connect(process.env.MONGODB_URI!)
    .then(() => {
    
        console.log(`Connection has been established successfully. \n`);

        roleController.insertRoles();
        categoryController.insertCategories();
        userController.insertFirstUserApp();

    })
    .catch((error) => {
       
        console.log('Unable to connect to the database: ', error);

    });

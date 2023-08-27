
import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { UpdateInfoUserDto } from "../dtos/update_info_user.dto";
import Role from "../models/role.model";
import User from "../models/user.model";
import usersService from "../services/users.service";
import authController from "./auth.controller";
import authService from "../services/auth.service";
import rolesService from "../services/roles.service";
import { ResponseDto } from "../common/dto/response.dto";
import { SigninUserDto } from "../dtos/signin_user.dto";
import authUtils from "../common/utils/auth.utils";
import { SignupUserDto } from "../dtos/signup_user.dto";
import { UpdateApprovedMotoristDto } from "../dtos/update_approved_motorist.dto";

class UserController {

    private roles = [ 'Admin', 'Client', 'Motorist' ];

    // Admin
    public getUsers = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list the users!'}));

            const users = await usersService.getUsers();

            res.status(users.code!).send(users);
            
        } catch (error) {

            if (error instanceof Error) {

                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    // Admin
    public getMotoristUsers = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list the motorist users!'}));
                
            const users = await usersService.searchUsersByRole('Motorist');

            res.status(users.code!).send(users);

        } catch (error) {

            if (error instanceof Error) {

                console.log(error);

                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };

    // Admin
    public getMotoristUsersByApproved = async (req: Request, res: Response) => {

        try {

            const { condition } = req.body;

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list the motorist users!'}));
                
            if (typeof condition !== 'boolean')
                throw new Error(JSON.stringify({ code: 401, message: 'The condition is not valid, it must be true or false.'}));
            
            const users = await usersService.searchUsersByApproved(condition);

            res.status(users.code!).send(users);

        } catch (error) {

            if (error instanceof Error) {

                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));
            
        }

    };    

    public profile = async (req: Request, res: Response) => {

        try {

            const { email } = authController.token;
            
            const user = await usersService.profile(email);

            const response: ResponseDto = {
                code: 200,
                message: 'Profile.',
                results : user
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

    public updateUser = async (req: Request, res: Response) => {

        try {

            const payload = req.body;
            const { email } = authController.token;
            
            const updateInfoUserDto = plainToClass(UpdateInfoUserDto, payload);
            const validatedUser = await usersService.validationUpdateInfoUser(updateInfoUserDto, email);

            const user = await User.findOne({ email }).populate('_id_role');
        
            user?.set({
                ...validatedUser
            });
            await user?.save();

            const updatedInfoUser = {
                _id: user?.id,
                ...validatedUser
            };

            const response: ResponseDto = {
                code: 200,
                message: 'User has been updated successfully.',
                results : updatedInfoUser
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

    // Admin
    public approvedMotorist = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin') 
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to approved motorist users!'}));
         
            const payload = req.body;
            const { email } = req.body;
            
            const updateInfoUserDto = plainToClass(UpdateApprovedMotoristDto, payload);
            const validatedUser = await usersService.validationApprovedMotorist(updateInfoUserDto, email);

            const user = await User.findOne({ email });
        
            user?.set({
                ...validatedUser
            });
            await user?.save();

            const updatedInfoUser = {
                _id: user?.id,
                name: user?.name,
                email,
                approved: validatedUser.approved
            };

            const response: ResponseDto = {
                code: 200,
                message: 'Motorist user has been updated successfully.',
                results : updatedInfoUser
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

    public deleteUser = async (req: Request, res: Response) => {

        try {

            const payload = req.body;
            
            if (authController.token.email !== payload.email) throw new Error(JSON.stringify({ code: 400, message: 'Email does not match!' }));

            const signinUserDto = plainToClass(SigninUserDto, payload);
            const validatedUser = await authService.validationSigninUser(signinUserDto);
        
            await User.deleteOne({ email: validatedUser.email }); 
            
            const response: ResponseDto = {
                code: 200,
                message: `The user with email '${validatedUser.email}' deleted successfully.`
            }

            res.status(response.code!).cookie('access_token', '').cookie('refresh_token', '').send(response);

        } catch (error) {

            if (error instanceof Error) {
                
                const info = JSON.parse(error.message);
                return res.status(info.code).send(info);
            
            }
            
            return res.status(500).send(String(error));

        }       

    };

    // Registrar a un admin
    public register_admin = async (req: Request, res: Response) => {

        try {

            if (authController.token.role !== 'Admin')
                throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to register admins!'}));

            const payload = req.body;

            payload.role = 'Admin';

            const signupUserAdminDto = plainToClass(SignupUserDto, payload);
            const validatedUser = await authService.validationSignupUser(signupUserAdminDto);

            const existsRole = await rolesService.getRoleByName(validatedUser.role);
            if (!existsRole) throw new Error(JSON.stringify({ code: 400, message: `The role '${validatedUser.role}' is not exists! The following roles exist...`, results: (await Role.find({ }, { _id: 0 }).sort({ name: 1 })).map(role => role.type) }));

            const newUser = await User.create({ 
                ...validatedUser,
                _id_role: existsRole._id,
            });

            const response: ResponseDto = {
                code: 201,
                message: 'New user admin created successfully.',
                results: newUser
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
    
    public insertFirstUserApp = async () => {

        try {

            const countUsers = await User.countDocuments();

            if (countUsers === 0) {

                const role = await rolesService.getRoleByName('Admin');

                await User.create({
                    name: 'First User',
                    email: 'firstuser@gmail.com',
                    password: await authUtils.encryptPassword('first'),
                    phone: 12,
                    _id_role: role?._id    
                });

            }
            
        } catch (error) {

            (error instanceof Error) ? console.log(error.message) :  console.log(String(error));
            
        }

    };

}

export default new UserController();

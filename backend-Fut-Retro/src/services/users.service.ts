
// User service
import { UpdateInfoUserDto } from "../dtos/update_info_user.dto";
import User from "../models/user.model";
import generalUtils from "../common/utils/general.utils";
import rolesService from "./roles.service";
import { ResponseDto } from "../common/dto/response.dto";
import { UpdateApprovedMotoristDto } from "../dtos/update_approved_motorist.dto";

class UsersService {

    // Admin
    public getUsers = async (): Promise<ResponseDto> => {

        const searchAllUsers = await User.find();

        if (searchAllUsers.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not users added!' }));

        return {
            code: 200,
            message: 'List of all users.',
            count: searchAllUsers.length,
            results: searchAllUsers 
        };

    };

    public profile = async (email: string) => {

        const existsUser = await User.findOne({ email }, [ '_id', 'name', 'phone', 'email']).populate('_id_role').then(data => data?.toJSON()); 

        if (!(existsUser)) throw new Error(JSON.stringify({ error: 404, message: 'User not exists!' }));

        const profile = {
            _id: existsUser._id,
            name: existsUser.name,
            phone: existsUser.phone,
            email: existsUser.email,
            role: existsUser._id_role.type
        }

        return profile;

    };

    public searchUserById = async (_id: string) => {

        const existsUser = await User.findOne({ _id }); 
        
        if (!(existsUser)) throw new Error(JSON.stringify({ error: 404, message: 'User not exists!' }));

        return existsUser;

    };

    public searchUserByEmail = async (email: string) => {

        const existsUser = await User.findOne({ email }); 

        return existsUser;

    };

    public searchUserInclude = async (email: string, model: any) => {

        const existsUser = await User.findOne({ where: { email }, include: [{ model }] }); 

        return existsUser;

    };

    public searchUsersByRole = async (roleFilter: string): Promise<ResponseDto> => {

        roleFilter = generalUtils.formattingWords(roleFilter);

        const users = await User.find().populate('_id_role', [ 'type' ]); 

        if (users.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: 'There are not users added!' }));

        const usersFiltering = users.map(user => {
            
            if (user._id_role.type === roleFilter) {

                return {
                    _id: user._id,
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    approved: user.approved
                };

            }

        }).filter(user => user !== undefined);

        if (usersFiltering.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: `There are not users added with role '${roleFilter}'!` }));

        return {
            code: 200,
            message: `This is the list of users of the '${roleFilter}' role.`,
            count: usersFiltering.length,
            results: usersFiltering
        };

    };

    public searchUsersByApproved = async (condition: boolean) => {

        const users = await User.find().populate('_id_role', [ 'type' ]); 

        if (users.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: 'There are not users added!' }));

        const usersFiltering = users.map(user => {
            
            if (user.approved === condition && user._id_role.type === 'Motorist') {

                return {
                    _id: user._id,
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    approved: user.approved
                };

            }

        }).filter(user => user !== undefined);

        if (usersFiltering.length === 0) 
            throw new Error(JSON.stringify({ code: 500, message: condition ? `There are not users added with approved!` : `There are not users added with not approved!` }));

        return {
            code: 200,
            message: condition ? `This is the list of motorist users approved.` : `This is the list of motorist users not approved.`,
            count: usersFiltering.length,
            results: usersFiltering
        };

    };

    public validationUpdateInfoUser = async (user: UpdateInfoUserDto, email: string): Promise<UpdateInfoUserDto> => {
        
        if (user.name !== undefined) user.name = generalUtils.formattingWords(user.name);

        const errors = await generalUtils.errorsFromValidate(user);

        if (errors !== undefined) throw new Error(JSON.stringify(errors));

        if (!(await this.searchUserByEmail(email!))) 
            throw new Error(JSON.stringify({ code: 404, message: 'User not exists!' }));

        if (user.role !== undefined) {

            user.role = generalUtils.formattingWords(user.role);
            const existsRole =  await rolesService.getRoleByName(user.role)

            if (!(existsRole)) 
                throw new Error(JSON.stringify({ code: 400, message: `The role '${user.role}' is not exists!` }));
            else
                user._id_role = existsRole._id;

        }

        return user;

    };

    public validationApprovedMotorist = async (user: UpdateApprovedMotoristDto, email: string): Promise<UpdateApprovedMotoristDto> => {
        
        const errors = await generalUtils.errorsFromValidate(user);

        if (errors !== undefined) throw new Error(JSON.stringify(errors));

        if (!(await this.searchUserByEmail(email!))) 
            throw new Error(JSON.stringify({ code: 404, message: 'User not exists!' }));

        return user;

    };

}

export default new UsersService();

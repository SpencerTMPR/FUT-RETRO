
// Roles service
import { ResponseDto } from "../common/dto/response.dto";
import generalUtils from "../common/utils/general.utils";
import { CreateRoleDto } from "../dtos/create_role.dto";
import Role from "../models/role.model";
import User from "../models/user.model";

class RolesService {

    public getRoles = async (): Promise<ResponseDto> => {

        const searchAllRoles = await Role.find();

        if (searchAllRoles.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not roles added!' }));

        return {
            code: 200,
            message: 'List of all roles.',
            count: searchAllRoles.length,
            results: searchAllRoles 
        };

    };

    public getRoleById = async (_id: string) => {

        if (!(generalUtils.validate_id(_id))) throw new Error(JSON.stringify({ code: 400, message: `_id '${_id}' is not valid!` }));

        const role = await Role.findById(_id);

        if (role === null) 
            throw new Error(JSON.stringify({ code: 404, message: 'Role is not exists! The following roles exist...', results: (await Role.find({ order: [['id', 'ASC']] })).filter(role => role.type !== 'Admin') }));

        return role;

    };

    public getRoleByEmail = async (email: string) => {

        const role = await User.findOne({ where: { email }, include: [{ model: Role }] }).then(info => info?.toJSON());
        
        return role;

    };

    public getRoleByName = async (type: string) => {

        type = generalUtils.formattingWords(type);

        const role = await Role.findOne({ type })

        return role;

    };

    public validationAddRole = async (role: CreateRoleDto): Promise<CreateRoleDto> => {

        const errors = await generalUtils.errorsFromValidate(role);

        if (errors !== undefined) throw new Error(JSON.stringify(errors));

        role.type = generalUtils.formattingWords(role.type);

        if ((await this.getRoleByName(role.type)) !== null) throw new Error(JSON.stringify({ code: 400, message: 'Role already exists!' }));

        return role;

    };

}

export default new RolesService();

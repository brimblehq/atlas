import { defaultErrorDto } from "@/types";
import { IUser, User } from "@brimble/models";

class UserService {

    public async fetchByID(id: string){
        try {
            return await User.findById(id);
        } catch (e) {
            const { message } = e as Error;
            throw {
                message,
                statusCode: 500,
            };
        }
    }
};


export default new UserService();
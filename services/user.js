import UserModel from "../models/user.js";
import { UserStatuses } from "../constants/user-constants.js";

const Service = {
	signup: async (body) => {
		try {
			body.status = UserStatuses.REGISTERED;
			return UserModel.create(body);
		} catch (error) {
			throw error;
		}
	},
};

export default Service;

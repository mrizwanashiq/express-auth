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

	findByFilter: async (query) => {
		try {
			return UserModel.find(query);
		} catch (error) {
			throw error;
		}
	},

	update: async ({ _id, password }) => {
		try {
			return UserModel.findOneAndUpdate({ _id }, { password });
		} catch (error) {
			throw error;
		}
	},
};

export default Service;

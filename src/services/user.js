import UserModel from "../models/user.js";
import { UserStatuses } from "../constants/user-constants.js";

const Service = {
	signup: async (body) => {
		body.status = UserStatuses.REGISTERED;
		return UserModel.create(body);
	},

	findByFilter: async (query) => {
		return UserModel.find(query);
	},

	update: async ({ _id, password }) => {
		return UserModel.findOneAndUpdate({ _id }, { password });
	},

	updatePassword: async ({ _id, password }) => {
		return UserModel.findOneAndUpdate({ _id }, { password });
	},
};

export default Service;

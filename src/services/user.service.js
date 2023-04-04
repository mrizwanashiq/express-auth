import UserModel from "../models/user.js";
import { UserStatuses } from "../constants/user-constants.js";
import bcrypt from "bcrypt";
import TokenService from "./token.service.js";

const Service = {
	signup: async (body) => {
		body.status = UserStatuses.REGISTERED;
		body.password = await bcrypt.hash(body.password, 10);
		return UserModel.create(body).then((user) => {
			delete user._doc.password;
			return user._doc;
		});
	},

	login: async ({ email, password }) => {
		const isExists = await UserModel.findOne({ email });
		if (!isExists) throw new Error("User not found");
		const isMatch = await bcrypt.compare(password, isExists.password);
		if (!isMatch) throw new Error("Password is incorrect");
		const token = await TokenService.createJwtToken(isExists._doc);
		return {
			token,
			status: isExists.status,
			isVerified: isExists.status === UserStatuses.VERIFIED,
		};
	},

	findByFilter: async (query) => {
		return UserModel.find(query).select("-password");
	},

	update: async ({ _id, ...rest }) => {
		if (rest.password) rest.password = await bcrypt.hash(rest.password, 10);
		return UserModel.findOneAndUpdate({ _id }, rest).select("-password");
	},

	updatePassword: async ({ _id, old_password, new_password }) => {
		const isExists = await UserModel.findById(_id);
		if (!isExists) throw new Error("User not found");
		const isMatch = await bcrypt.compare(old_password, isExists.password);
		if (!isMatch) throw new Error("Password is incorrect");
		isExists.password = await bcrypt.hash(new_password, 10);
		return isExists.save().then((user) => {
			delete user._doc.password;
			return user._doc;
		});
	},

	findById: async (_id) => {
		return UserModel.findById(_id).select("-password");
	},
};

export default Service;

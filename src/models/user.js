import mongoose from "mongoose";
import { UserStatusesArray } from "../constants/user-constants.js";

const { Schema } = mongoose;
const schema = new Schema({
	name: {
		type: String,
		required: true,
		maxlength: 50,
	},
	email: {
		type: String,
		required: true,
		maxlength: 50,
		unique: true,
	},
	phone: {
		type: Number,
		// required: true,
		// unique: true,
		maxlength: 12,
	},
	password: {
		type: String,
		required: true,
		maxlength: 500,
	},
	status: {
		type: String,
		required: true,
		maxlength: 50,
		enum: UserStatusesArray,
	},
	address: {
		type: String,
		maxlength: 200,
	},
	is_active: {
		type: Boolean,
		default: true,
	},
});

export default mongoose.model("User", schema);

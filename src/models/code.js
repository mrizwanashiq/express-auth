import mongoose from "mongoose";
import { AllIntents } from "../constants/code-verification-constant.js";

const { Schema } = mongoose;
const schema = new Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	intent: {
		type: String,
		required: true,
		maxlength: 50,
		enum: AllIntents,
	},
	code: {
		type: Number,
		required: true,
	},
	exp: {
		type: Number,
		required: true,
	},
});
export default mongoose.model("Code", schema);

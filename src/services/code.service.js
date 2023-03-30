import CodeModel from "../models/code.js";
import { randomInt } from "crypto";
import { CodeVerificationOptions } from "../constants/code-verification-constant.js";

const CodeService = {
	generate: async ({ user_id, intent }) => {
		const code = generateRandomCodeNumber();
		const exp =
			new Date().getTime() + CodeVerificationOptions.EXPIRATION_TIME * 1000;

		const codeExists = await CodeModel.findOne({
			user_id,
			intent,
		});

		if (codeExists) {
			await codeExists.updateOne({
				exp,
				code,
			});
		} else {
			await CodeModel.create({
				user_id,
				intent,
				exp,
				code,
			});
		}

		return { user_id, intent, code, exp };
	},

	validate: async ({ code, intent, shouldDelete = true }) => {
		const result = await CodeModel.findOne({
			intent,
			code,
		});

		if (!result) {
			throw new Error("Code not found");
		}

		if (shouldDelete) {
			// now should delete the after validation
			await CodeService.deleteCode(result._id);
		}

		if (new Date().getTime() > result._doc.exp) {
			throw new Error("Code expired");
		}

		return result;
	},

	deleteCode: async (_id) => {
		return CodeModel.deleteOne({ _id });
	},
};

export default CodeService;

const generateRandomCodeNumber = () => randomInt(10000, 99999);

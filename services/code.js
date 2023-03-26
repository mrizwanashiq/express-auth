import CodeModel from "../models/code.js";
import { randomInt } from "crypto";
import { CodeVerificationOptions } from "../constants/code-verification-constant.js";

const CodeService = {
	generate: async ({ user_id, intent }) => {
		try {
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
		} catch (error) {
			throw error;
		}
	},

	validate: async ({ userId, code, intent, shouldDelete = true }) => {
		const result = await CodeModel.findOne({
			user_id: userId,
			intent,
			code,
		});

		if (!result) {
			return ServiceResponse.failed({
				code: ErrorCodes.INVALID_VERIFICATION_CODE,
				status: 404,
			});
		}

		if (shouldDelete) {
			// now should delete the after validation
			await this.deleteCode({ userId, intent, code });
		}

		if (new Date().getTime() > result._doc.exp) {
			return ServiceResponse.failed({
				code: ErrorCodes.VERIFICATION_CODE_EXPIRED,
				status: 410,
			});
		}

		return ServiceResponse.success({ status: 200 });
	},

	deleteCode: async ({ userId, intent, code }) => {
		await CodeModel.deleteOne({
			user_id: payload.userId,
			intent: payload.intent,
			code: payload.code,
		});

		return true;
	},
};

export default CodeService;

const generateRandomCodeNumber = () => randomInt(10000, 99999);

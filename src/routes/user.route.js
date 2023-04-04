import express from "express";
import UserService from "../services/user.service.js";
import CodeService from "../services/code.service.js";
import { CodeVerificationUnProtectedIntents } from "../constants/code-verification-constant.js";
import validate from "../middleware/validation.js";
import authenticate from "../middleware/authenticate.js";
import userValidationSchema from "../validations/user.validation.schema.js";
import { UserStatuses } from "../constants/user-constants.js";

const router = express.Router();

router.post(
	"/signup",
	validate(userValidationSchema.register),
	async (req, res) => {
		try {
			const data = await UserService.signup(req.body);
			const code = await CodeService.generate({
				user_id: data._id,
				intent: CodeVerificationUnProtectedIntents.REGISTRATION,
			});

			// ⚠️ uncomment this code 👇 once you set the credentials to send email in environment variables

			// MessageService.sendEmail({
			// 	message: `your code is ${code.code}`,
			// 	to: req.body.email,
			// 	subject: "Verify You Email",
			// });

			res
				.status(201)
				.json({ message: "user registered", data, code: code.code });
			// ❌ Code must not be sent to the client as response, it is serious security issue
			// Here we are sending it for testing purposes only, as we are not sending email
		} catch ({ message }) {
			res.status(400).json({ message });
		}
	}
);

router.post(
	"/login",
	validate(userValidationSchema.login),
	async (req, res) => {
		try {
			const data = await UserService.login(req.body);
			res.status(200).json({ message: "user logged in", data });
		} catch ({ message }) {
			res.status(400).json({ message });
		}
	}
);

router.post(
	"/forget-password",
	validate(userValidationSchema.forgetPassword),
	async (req, res) => {
		try {
			const [user] = await UserService.findByFilter({ email: req.body.email });

			if (!user) {
				return res.status(404).json({ message: "user not found" });
			}

			const code = await CodeService.generate({
				user_id: user._id,
				intent: CodeVerificationUnProtectedIntents.FORGET_PASSWORD,
			});

			// ⚠️ uncomment this code 👇 once you set the credentials to send email in environment variables

			// MessageService.sendEmail({
			// 	message: `your code is ${code.code}`,
			// 	to: req.body.email,
			// 	subject: "Reset Password",
			// });

			res.status(201).json({ message: "Code mailed", code: code.code });
			// ❌ This API MUST NOT SEND CODE IN THE RESPONSE, this is just for testing, and development purpose. Code must be deliver via email, or message
			// but as the mailing code is commented, that's why I am sending it in the response
		} catch ({ message }) {
			res.status(400).json({ message });
		}
	}
);

router.post(
	"/forget-password/update",
	validate(userValidationSchema.forgetPasswordUpdate),
	async (req, res) => {
		try {
			const code = await CodeService.validate({
				code: req.body.code,
				intent: CodeVerificationUnProtectedIntents.FORGET_PASSWORD,
			});

			await UserService.update({
				_id: code.user_id,
				password: req.body.password,
			});

			res.status(201).json({ message: "Password Reset" });
		} catch ({ message }) {
			res.status(400).json({ message });
		}
	}
);

router.post(
	"/verify-email",
	validate(userValidationSchema.verifyEmail),
	async (req, res) => {
		try {
			const code = await CodeService.validate({
				code: req.body.code,
				intent: CodeVerificationUnProtectedIntents.REGISTRATION,
			});

			await UserService.update({
				_id: code.user_id,
				status: UserStatuses.VERIFIED,
			});

			res.status(201).json({ message: "Email Verified" });
		} catch ({ message }) {
			res.status(400).json({ message });
		}
	}
);
router.get("/me", authenticate, async (req, res) => {
	try {
		const data = await UserService.findById(req.user._id);
		res.status(200).json({ message: "user details", data });
	} catch ({ message }) {
		res.status(400).json({ message });
	}
});

router.post(
	"/update-password",
	authenticate,
	validate(userValidationSchema.updatePassword),
	async (req, res) => {
		try {
			const data = await UserService.updatePassword({
				_id: req.user._id,
				...req.body,
			});
			res.status(200).json({ message: "password updated", data });
		} catch ({ message }) {
			res.status(400).json({ message });
		}
	}
);

router.patch(
	"/update-profile",
	authenticate,
	validate(userValidationSchema.updateProfile),
	async (req, res) => {
		try {
			const data = await UserService.update({ _id: req.user._id, ...req.body });
			res.status(200).json({ message: "profile updated", data });
		} catch ({ message }) {
			res.status(400).json({ message });
		}
	}
);

export default router;

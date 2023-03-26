import express from "express";
import UserService from "../services/user.js";
import CodeService from "../services/code.js";
import MessageService from "../services/message.js";
import { CodeVerificationUnProtectedIntents } from "../constants/code-verification-constant.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
	try {
		const data = await UserService.signup(req.body);
		const code = await CodeService.generate({
			user_id: data._id,
			intent: CodeVerificationUnProtectedIntents.REGISTRATION,
		});
		MessageService.sendEmail({
			message: `your code is ${code.code}`,
			to: req.body.email,
			subject: "Verify You Email",
		});

		res.status(201).json({ message: "user registered" });
	} catch (error) {
		res.status(400).json(error);
	}
});

export default router;

import nodemailer from "nodemailer";
import config from "../config/index.js";

const MessageService = {
	sendEmail: async ({ message, to, subject, addressTitle, replyTo }) => {
		const transporter = nodemailer.createTransport({
			host: config.env.messageService.emailHost,
			secure: config.env.messageService.emailIsSecure,
			auth: {
				user: config.env.messageService.emailAddress,
				pass: config.env.messageService.emailPassword,
			},
		});

		const emailData = {
			subject,
			to,
			from: addressTitle
				? `${addressTitle} <${config.env.messageService.emailAddress}>`
				: config.env.messageService.emailAddress,
			text: message,
		};

		if (replyTo) emailData.replyTo = replyTo;

		return transporter.sendMail(emailData);
	},

	sendPhoneMessage: async ({ message, to }) => {
		const accountSid = config.env.messageService.twilioAccountSid;
		const authToken = config.env.messageService.twilioAuthToken;
		const client = require("twilio")(accountSid, authToken);
		return client.messages.create({
			body: message,
			from: config.env.messageService.twilioSenderPhoneNumber,
			to,
		});
	},
};

export default MessageService;

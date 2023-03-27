import Joi from "joi";

export default {
	id: {
		params: Joi.object().keys({
			id: Joi.string().required(),
		}),
	},

	register: {
		body: Joi.object().keys({
			name: Joi.string().required(),
			email: Joi.string().required().email(),
			password: Joi.string().required(),
			address: Joi.string(),
		}),
	},

	login: {
		body: Joi.object().keys({
			email: Joi.string().required().email(),
			password: Joi.string().required(),
		}),
	},

	update: {
		params: Joi.object().keys({
			id: Joi.string().required(),
		}),

		body: Joi.object().keys({
			name: Joi.string(),
			email: Joi.string().email(),
			password: Joi.string(),
			address: Joi.string(),
		}),
	},

	forgetPassword: {
		body: Joi.object().keys({
			email: Joi.string().email(),
		}),
	},

	forgetPasswordUpdate: {
		body: Joi.object().keys({
			code: Joi.number(),
			password: Joi.string(),
		}),
	},
};

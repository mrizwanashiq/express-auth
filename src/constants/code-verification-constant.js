export const CodeVerificationUnProtectedIntents = {
	REGISTRATION: "registration",
	FORGET_PASSWORD: "forget_password",
};

export const AllIntents = Object.values(CodeVerificationUnProtectedIntents);

export const CodeVerificationOptions = {
	EXPIRATION_TIME: 10 * 60, // 600 seconds/10 mins
};

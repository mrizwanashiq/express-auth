export const CodeVerificationUnProtectedIntents = {
	REGISTRATION: "registration",
	FORGET_PASSWORD: "forget_password",
};

export const AllIntents = ["registration", "forget_password"];

export const CodeVerificationOptions = {
	EXPIRATION_TIME: 10 * 60, // 600 seconds/10 mins
};

import jwt from "jsonwebtoken";
import config from "../config/index.js";

export default {
	createJwtToken: async (jwtPayload) =>
		jwt.sign(jwtPayload, config.env.tokens.jwtSecret),
	verifyAndExtractJwtToken: async (jwtToken) =>
		jwt.verify(jwtToken, config.env.tokens.jwtSecret),
};

import jwt from "jsonwebtoken"

export default {
    createJwtToken: async (jwtPayload) => jwt.sign(jwtPayload, 'secret' ),
    verifyAndExtractJwtToken: async (jwtToken) => jwt.verify(jwtToken, 'secret' )
}

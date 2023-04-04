import jwt from "jsonwebtoken";

export default function authenticate(req, res, next) {
    const token = req.header("authorization");
    if (!token) return res.status(401).send("Access denied. No token provided.");

    const bearerToken = token.split(" ")[1];

    try {
        req.user = jwt.verify(bearerToken, "secret");
        next();
    } catch (ex) {
        res.status(400).send("Invalid token.");
    }
}
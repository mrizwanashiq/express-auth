import userRoute from "./user.js";
import express from "express";
const unprotectedRoute = express.Router();
const protectedRoute = express.Router();

unprotectedRoute.use("/auth", userRoute);

export { unprotectedRoute, protectedRoute };

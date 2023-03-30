import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { unprotectedRoute, protectedRoute } from "./routes/index.js";

const app = express();
app.use(bodyParser.json());

const connection = mongoose.connection;

connection.once("connected", () => console.log("Database Connected ~"));
connection.on("error", (error) => console.log("Database Error: ", error));
mongoose.connect("mongodb://127.0.0.1:27017/my_first_data_base", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.use(unprotectedRoute);
app.use(protectedRoute);

app.listen(2022, () => {
	console.log("connected on port 2022");
});

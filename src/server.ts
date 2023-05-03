import express from "express";
import morgan from "morgan";
import router from "./router";
import cors from "cors";
import { protect } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", protect, router);

app.post("/register", createNewUser);
app.post("/login", signIn);

export default app;

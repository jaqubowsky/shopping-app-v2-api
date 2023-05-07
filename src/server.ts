import express from "express";
import morgan from "morgan";
import router from "./router";
import cors from "cors";
import { protect } from "./modules/auth";
import cookieParser from "cookie-parser";
import { createNewUser, logout, signIn } from "./handlers/user";

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", protect, router);

app.post("/register", createNewUser);
app.post("/login", signIn);
app.get("/logout", logout);

app.use((err, req, res, next) => {
  if (err.type === "auth") {
    return res.status(401).json({ error: "Unauthorized" });
  } else if (err.type === "input") {
    return res.status(400).json({ error: "Invalid input!" });
  } else {
    return res.status(err.code || 500).json({ error: err.message });
  }
});

export default app;

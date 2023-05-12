import express from "express";
import morgan from "morgan";
import router from "./router";
import cors from "cors";
import { protect } from "./modules/auth";
import cookieParser from "cookie-parser";
import { createNewUser, loggedIn, logout, signIn } from "./handlers/user";
import { getAllProducts } from "./handlers/product";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", protect, router);

app.get("/allproducts", getAllProducts);
app.post("/register", createNewUser);
app.post("/login", signIn);
app.get("/logout", logout);
app.get("/logged-in", loggedIn);

app.use((err, req, res, next) => {
  // return res.status(err.code || 500).json({ error: err.message });
  return res.status(err.code).json({ error: err.message });
});

export default app;

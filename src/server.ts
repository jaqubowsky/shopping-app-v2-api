import express from "express";
import morgan from "morgan";
import router from "./router";
import helmet from "helmet";
import cors from "cors";
import { protect } from "./modules/auth";
import cookieParser from "cookie-parser";
import {
  createNewUser,
  getUserById,
  loggedIn,
  logout,
  signIn,
} from "./handlers/user";
import {
  getAllProducts,
  getProduct,
} from "./handlers/product";

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
app.disable("x-powered-by");
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use("/api", protect, router);

app.get("/allproducts", getAllProducts);
app.post("/register", createNewUser);
app.post("/login", signIn);
app.get("/logout", logout);
app.get("/logged-in", loggedIn);
app.get("/user/:id", getUserById);

app.get("/product/:id", getProduct);

app.use((err, req, res, next) => {
  return res.status(err.code).json({ error: err });
});

export default app;

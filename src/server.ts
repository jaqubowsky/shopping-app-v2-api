import express from "express";
import morgan from "morgan";
import router from "./router";
import helmet from "helmet";
import cors from "cors";
import { protect } from "./modules/auth";
import cookieParser from "cookie-parser";
import { createNewUser, getUserById, loggedIn, signIn } from "./handlers/user";
import { getAllProducts, getProduct } from "./handlers/product";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./api-docs/api.json";

const app = express();

app.set("trust proxy", 1);
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.TRUST_ORIGIN, "http://localhost:3001"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.disable("x-powered-by");
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/protected", protect, router);

app.get("/api/products/all", getAllProducts);
app.get("/api/products/:id", getProduct);

// USERS ROUTES
app.post("/api/users/register", createNewUser);
app.post("/api/users/login", signIn);
app.get("/api/users/logged-in", loggedIn);
app.get("/api/users/:id", getUserById);

app.use((err, req, res, next) => {
  return res.status(err.code || 500).json({ error: err.message });
});

export default app;

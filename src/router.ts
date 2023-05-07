import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "./middlewares/handleInputMiddleware";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  getUserProducts,
  updateProduct,
} from "./handlers/product";

const router = Router();

router.get("/allproducts", getAllProducts);

router.get("/product", getUserProducts);

router.get("/product/:id", getProduct);

router.put(
  "/product/:id",
  body("name").isString().optional(),
  body("description").isString().optional(),
  body("price").isNumeric().optional(),
  body("picture").isString().optional(),
  handleInputErrors,
  updateProduct
);

router.post(
  "/product",
  body("name").exists().isString(),
  body("description").isString().optional(),
  body("price").exists().isNumeric(),
  body("picture").exists().isString(),
  handleInputErrors,
  createProduct
);

router.delete("/product/:id", deleteProduct);

router.use((err, req, res, next) => {
  return res.status(err.code || 500).json({ error: err.message });
});

export default router;

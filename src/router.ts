import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "./middlewares/handleInputMiddleware";
import {
  createProduct,
  deleteProduct,
  getUserProducts,
  updateProduct,
} from "./handlers/product";
import Multer from "multer";
import { addToCart, deleteFromCart, getCartItems } from "./handlers/cart";
import { deleteAccount } from "./handlers/user";

const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
  fileFilter: (req, file, cb) => {
    if (!file || !file.mimetype || !file.mimetype.startsWith("image")) {
      return cb(new Error("File type not supported"), false);
    }
    cb(null, true);
  },
});

const router = Router();

router.get("/users/products", getUserProducts);

router.put(
  "/api/products/:id",
  upload.single("image"),
  body("name").isString().optional(),
  body("description").isString().optional(),
  body("category").isString().optional(),
  body("price").isNumeric().optional(),
  body("location").isString().optional(),
  body("phoneNumber").isNumeric().optional(),
  handleInputErrors,
  updateProduct
);

router.post(
  "/api/products",
  upload.single("image"),
  body("name").exists().isString(),
  body("description").isString().optional(),
  body("category").exists().isString(),
  body("price").exists().isNumeric(),
  body("location").exists().isString(),
  body("email").exists().isEmail(),
  body("phoneNumber").exists().isNumeric(),
  handleInputErrors,
  createProduct
);

router.delete("/api/products/:id", deleteProduct);

router.get("/api/cart", getCartItems)
router.post("/api/cart", addToCart);
router.delete("/api/cart/:id", deleteFromCart)

router.delete("/api/users/:id", deleteAccount)

router.use((err, req, res, next) => {
  return res.status(err.code || 500).json({ error: err.message });
});

export default router;

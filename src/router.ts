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

const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
      return cb(new Error("File type not supported"), false);
    }
    cb(null, true);
  },
});

const router = Router();

router.get("/products", getUserProducts);

router.put(
  "/product/:id",
  body("name").isString().optional(),
  body("description").isString().optional(),
  body("price").isNumeric().optional(),
  handleInputErrors,
  updateProduct
);

router.post(
  "/product",
  upload.single("image"),
  body("name").exists().isString(),
  body("description").isString().optional(),
  body("category").exists().isString(),
  body("price").exists().isNumeric(),
  handleInputErrors,
  createProduct
);

router.delete("/product/:id", deleteProduct);

router.use((err, req, res, next) => {
  return res.status(err.code || 500).json({ error: err.message });
});

export default router;

import { Router } from "express";

const router = Router();

router.get("/product", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});
router.get("/product/:id", () => {});
router.put("/product/:id", () => {});
router.post("/product", () => {});
router.delete("/product/:id", () => {});

export default router
import prisma from "../db";

// Get all products from database
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();

    res.json({ data: products });
  } catch (err) {
    next(err);
  }
};

// Get all products
export const getUserProducts = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        products: true,
      },
    });

    res.json({ data: user.products });
  } catch (err) {
    next(err);
  }
};

// Get a single product
export const getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    const product = await prisma.product.findFirst({
      where: {
        id,
        belongsToId: req.user.id,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
};

// Create a new product
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, picture } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        picture,
        belongsToId: req.user.id,
      },
    });

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
};

// Update a product
export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, description, price, picture } = req.body;

    const updated = await prisma.product.update({
      where: {
        id_belongsToId: {
          id,
          belongsToId: req.user.id,
        },
      },
      data: {
        name,
        description,
        price,
        picture,
      },
    });

    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
};

// Delete a product
export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    const deleted = await prisma.product.delete({
      where: {
        id_belongsToId: {
          id,
          belongsToId: req.user.id,
        },
      },
    });

    res.json({ data: deleted });
  } catch (err) {
    next(err);
  }
};

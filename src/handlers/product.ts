import prisma, { bucket } from "../db.js";

// Get all products from database
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();

    res.json({ products });
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

    const products = user.products;

    res.json({ products });
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
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (err) {
    next(err);
  }
};

// Create a new product
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, location, email, username } = req.body;
    const price = Number(req.body.price);
    const phoneNumber = Number(req.body.phoneNumber);
    const file = req.file;

    let imageUrl = null;
    if (file) {
      const filename = `${file.originalname}-${Date.now()}`;

      const blob = bucket.file(filename);

      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      imageUrl = new Promise((resolve, reject) => {
        blobStream.on("error", (err) => {
          reject(err);
        });

        blobStream.on("finish", () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(publicUrl);
        });

        blobStream.end(file.buffer);
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        location,
        phoneNumber,
        email,
        imageUrl: await imageUrl,
        createdBy: username,
        createdAt: new Date(),
        belongsTo: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
};

// Update a product
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, category, location } = req.body;
    const price = Number(req.body.price);
    const phoneNumber = Number(req.body.phoneNumber);
    const file = req.file;

    let imageUrl = null;

    const product = await prisma.product.findFirst({
      where: {
        name,
        belongsToId: req.user.id,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the image from Google Cloud Storage
    if (product.imageUrl) {
      const filename = product.imageUrl.split("/").pop();
      const fileToDelete = bucket.file(filename);
      await fileToDelete.delete();
    }

    if (file) {
      const filename = `${name}-${Date.now()}-${file.originalname}`;

      const blob = bucket.file(filename);

      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      imageUrl = new Promise((resolve, reject) => {
        blobStream.on("error", (err) => {
          reject(err);
        });

        blobStream.on("finish", () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(publicUrl);
        });

        blobStream.end(file.buffer);
      });
    }

    const data: {
      name: any;
      category: any;
      description: any;
      price: number;
      imageUrl?: string;
      location: any;
      phoneNumber: number;
    } = {
      name,
      category,
      description,
      price,
      location,
      phoneNumber,
    };

    if (imageUrl) {
      data.imageUrl = await imageUrl;
    }

    const updated = await prisma.product.update({
      where: {
        id: product.id,
      },
      data,
    });

    res.status(201).json({ updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Get the product to be deleted
    const product = await prisma.product.findFirst({
      where: {
        id,
        belongsToId: req.user.id,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the image from Google Cloud Storage
    if (product.imageUrl) {
      const filename = product.imageUrl.split("/").pop();

      const file = bucket.file(filename);

      await file.delete();
    }

    // Delete the product from the database
    const deleted = await prisma.product.delete({
      where: {
        id_belongsToId: {
          id,
          belongsToId: req.user.id,
        },
      },
    });

    res.json({ deleted });
  } catch (err) {
    next(err);
  }
};

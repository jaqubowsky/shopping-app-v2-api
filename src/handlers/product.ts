import prisma, { bucket } from "../db";

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
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product });
  } catch (err) {
    next(err);
  }
};

// Create a new product
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, location, email } = req.body;
    const price = Number(req.body.price);
    const phoneNumber = Number(req.body.phoneNumber);
    const file = req.file;

    let publicUrlPromise;
    const filename = `${file.originalname}-${Date.now()}`;

    if (file) {
      const blob = bucket.file(filename);

      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      publicUrlPromise = new Promise((resolve, reject) => {
        blobStream.on("finish", () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(publicUrl);
        });
        blobStream.end(file.buffer);
      });
    }

    const publicUrl = await publicUrlPromise;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        location,
        phoneNumber,
        email,
        imageUrl: publicUrl,
        createdBy: req.user.username,
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
    const id = req.params.id;
    const { name, description, price, imageUrl } = req.body;

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
        imageUrl,
      },
    });

    res.json({ updated });
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

    res.json({ deleted });
  } catch (err) {
    next(err);
  }
};

export const uploadImage = async (req, res, next) => {
  console.log(req.file);
  res.status(200).json({ message: "File uploaded successfully" });
};

import prisma from "../db";

export const getCartItems = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        cart: true,
      },
    });

    const cart = user.cart;

    const cartItems = await prisma.cartItem.findMany({
      include: {
        cartItem: true,
        belongsTo: true,
      },
      where: {
        belongsTo: {
          id: cart.id,
        },
      },
    });

    // Map the cartItems to a new array with the desired properties
    const cartItemsWithProduct = cartItems.map((cartItem) => ({
      product: cartItem.cartItem,
      addedAt: cartItem.createdAt,
      id: cartItem.id,
    }));

    // Send the response to the frontend
    res.json({ cartItems: cartItemsWithProduct });
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { cart: true },
    });

    const cartItem = await prisma.cartItem.create({
      data: {
        belongsTo: {
          connect: {
            id: user.cart.id,
          },
        },
        cartItem: {
          connect: {
            id: req.params.id,
          },
        },
      },
    });

    res.json({ cartItem });
  } catch (err) {
    next(err);
  }
};

export const deleteFromCart = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find the cart item by cartItemId
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (err) {
    next(err);
  }
};

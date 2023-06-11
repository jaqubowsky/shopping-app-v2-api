import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";
import jwt from "jsonwebtoken";

export const createNewUser = async (req, res, next) => {
  try {
    const number = parseInt(req.body.phoneNumber);

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        surname: req.body.surname,
        location: req.body.location,
        phoneNumber: number,
        username: req.body.username,
        email: req.body.email,
        password: await hashPassword(req.body.password),
        cart: {
          create: {},
        },
      },
      include: {
        cart: true,
      },
    });

    const token = createJWT(user);

    res.status(200).json({ message: "User created successfully.", token });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res
          .status(409)
          .json({ message: "Username or email already exists." });
      }
    } else if (err instanceof PrismaClientValidationError) {
      return res.status(400).json({ message: "Some fields are missing." });
    } else {
      next(err);
    }
  }
};

export const signIn = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Wrong email or password!" });
    }

    const token = createJWT(user);

    res.status(200).json({
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
      token,
    });
  } catch (err) {
    res.status(401).send({ message: "User with this email do not exist!" });
  }
};

export const loggedIn = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res
        .status(200)
        .send({ user: null, isLoggedIn: false, message: "Not authorized." });
    }

    const token = authToken.split(" ")[1];

    if (!token) {
      return res
        .status(200)
        .send({ user: null, isLoggedIn: false, message: "Not authorized." });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user) {
      const prismaUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      req.user = prismaUser;

      res.status(200).json({
        user: {
          id: req.user.id,
          name: req.user.name,
          username: req.user.username,
          location: req.user.location,
          phoneNumber: req.user.phoneNumber,

          email: req.user.email,
          createdAt: req.user.createdAt,
          imageUrl: req.user.imageUrl,
        },
        isLoggedIn: true,
        message: "Authorized.",
      });
    } else {
      res
        .status(200)
        .send({ user: null, isLoggedIn: false, message: "Not authorized." });
    }
  } catch (err) {
    res
      .status(401)
      .send({ user: null, isLoggedIn: false, message: "Unexpected error" });
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const prismaUser = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });

    req.user = prismaUser;

    res.status(200).json({
      user: {
        username: req.user.username,
        name: req.user.name,
        phoneNumber: req.user.phoneNumber,
        email: req.user.email,
        imageUrl: req.user.imageUrl,
      },
    });
  } catch (err) {
    res.status(404).json({ message: "User not found." });
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Delete cart items associated with the user
    await prisma.cartItem.deleteMany({
      where: {
        belongsTo: {
          belongsToId: userId,
        },
      },
    });

    // Delete cart associated with the user
    await prisma.cart.deleteMany({
      where: {
        belongsToId: userId,
      },
    });

    // Delete products associated with the user
    await prisma.product.deleteMany({
      where: {
        belongsToId: userId,
      },
    });

    // Delete the user
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    next(err);
  }
};

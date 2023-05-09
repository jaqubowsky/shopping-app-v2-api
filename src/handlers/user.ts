import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";
import jwt from "jsonwebtoken";

export const createNewUser = async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: await hashPassword(req.body.password),
      },
    });

    const token = createJWT(user);
    res
      .cookie("token", token, { httpOnly: true, maxAge: 86400000 })
      .status(200)
      .json({
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl,
      });
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
        username: req.body.username,
        email: req.body.email,
      },
    });

    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Wrong password!" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, { httpOnly: true, maxAge: 86400000 })
      .status(200)
      .json({
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl,
      });
  } catch (err) {
    err.type = "auth";
    next(err);
  }
};

export const loggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send({ user: null });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    res.status(200).json({
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
    });
    
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.status(401).send({ message: "Not authorized" });
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token").status(200).json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

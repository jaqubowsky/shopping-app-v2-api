import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const comparePasswords = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, usernameOrEmail: user.username | user.email },
    process.env.JWT_SECRET
  );
  return token;
};

export const protect = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).send({ message: "Not authorized" });
  }

  const token = authToken.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Not valid token" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Not valid token" });
  }
};


import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  if (!token) {
    return res.status(401).send({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, "9F338C12E915C1A78AFF25417C789yfhhhf"); // Verify token
    req.userId = decoded.userId; // Attach userId to request object
    next();
  } catch (error) {
    return res.status(403).send({ message: "Invalid or expired token" });
  }
};

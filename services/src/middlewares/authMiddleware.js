import jwt from "jsonwebtoken";

const JWT_SECRET = "super-secret-poc-key";

export const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader)
    return res.status(403).json({ message: "No token provided" });

  const token = bearerHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded;
    next();
  });
};

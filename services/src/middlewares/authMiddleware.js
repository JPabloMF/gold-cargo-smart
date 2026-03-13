import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-poc-key";

export const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    console.warn("[Auth Middleware] No Authorization header provided");
    return res.status(403).json({ message: "No token provided" });
  }

  const token = bearerHeader.split(" ")[1];
  if (!token) {
    console.warn("[Auth Middleware] No token found in Authorization header");
    return res.status(403).json({ message: "Malformed Authorization header" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("[Auth Middleware] Token verification failed:", err.message);
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
    
    req.user = decoded;
    next();
  });
};
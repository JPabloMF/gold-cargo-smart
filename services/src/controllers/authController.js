import jwt from "jsonwebtoken";

const JWT_SECRET = "super-secret-poc-key";

export const login = (req, res) => {
  const { email, password } = req.body;

  // Mock database check
  if (email === "admin@goldcargo.com" && password === "password123") {
    const token = jwt.sign({ id: 1, email, role: "admin" }, JWT_SECRET, {
      expiresIn: "2h",
    });
    return res.json({ success: true, token, user: { email, role: "admin" } });
  }

  return res
    .status(401)
    .json({ success: false, message: "Invalid credentials" });
};

import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-poc-key";

export const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    console.log(`[Auth] Attempting to register user: ${email}`);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn(`[Auth] Registration failed: User ${email} already exists`);
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = new User({ email, password, role });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "2h",
    });

    console.log(`[Auth] User registered successfully: ${email}`);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(`[Auth] Registration error for ${email}:`, error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during registration", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`[Auth] Login attempt for: ${email}`);
    
    // Check user in database
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`[Auth] Login failed: User ${email} not found`);
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn(`[Auth] Login failed: Incorrect password for ${email}`);
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "2h",
    });

    console.log(`[Auth] User logged in successfully: ${email}`);
    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(`[Auth] Login error for ${email}:`, error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during login", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "No token found. Please log in again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "email isAdmin isActive"
    );

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "User not found. Please log in." });
    }

    if (!user.isActive) {
      return res
        .status(401)
        .json({ status: false, message: "Account deactivated." });
    }

    req.user = {
      userId: decoded.userId,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res
      .status(401)
      .json({ status: false, message: "Invalid or expired token." });
  }
});

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin.",
    });
  }
};

export { protectRoute, isAdminRoute };

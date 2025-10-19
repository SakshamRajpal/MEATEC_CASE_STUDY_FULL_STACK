// server/utils/index.js

import jwt from "jsonwebtoken";

// This function now RETURNS the token
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // It ALSO sets the HTTP-Only cookie, which is good for security
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token; // Return the token so we can send it in the response body
};

export default generateToken;
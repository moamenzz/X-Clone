import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const handleRegister = async (req, res) => {
  try {
    const { email, name, username, password } = req.body;

    if (!email || !name || !username || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existingEmail = await User.findOne({ email });

    if (existingEmail)
      return res.status(401).json({ error: "Email already in use" });

    const existingUsername = await User.findOne({ username });

    if (existingUsername)
      return res.status(401).json({ error: "Username already in use" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email,
      name,
      username: username,
      password: hashedPassword,
    });
    console.log(user);

    res.status(200).json({ user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server Error" });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid Credentials" });

    const roles = Object.values(user.roles).filter(Boolean);
    const accessToken = jwt.sign(
      {
        userinfo: {
          id: user._id,
          email: user.email,
          username: user.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        email: user.email,
        Id: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();
    console.log(user);

    res.cookie("token", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user, accessToken });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.token)
    return res.status(400).json({ error: "User not logged in" });

  const refreshToken = cookies.token;

  const user = await User.findOne({ refreshToken });
  if (!user) return res.status(404).json({ error: "User not found" });

  user.refreshToken = "";
  await user.save();

  res.clearCookie("token");
  res.status(200).json({ Success: "Successfully Logged out" });
};

export const handleRefresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.token)
    return res.status(400).json({ error: "User not logged in" });

  const refreshToken = cookies.token;

  const user = await User.findOne({ refreshToken });
  if (!user) return res.status(403).json({ error: "Invalid token" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.email !== decoded.email)
      return res.status(403).json({ error: "Decoded info doesnt match" });

    const accessToken = jwt.sign(
      {
        userinfo: {
          id: user._id,
          email: user.email,
          username: user.username,
          roles: user.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json(accessToken);
  });
};

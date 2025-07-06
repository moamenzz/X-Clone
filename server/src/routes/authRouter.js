import express from "express";
import {
  handleLogin,
  handleLogout,
  handleRefresh,
  handleRegister,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", handleRegister);

authRouter.post("/login", handleLogin);

authRouter.get("/logout", handleLogout);
authRouter.get("/refresh", handleRefresh);

export default authRouter;

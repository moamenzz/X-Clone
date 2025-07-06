import express from "express";
import {
  getCreatorsForYou,
  getCreatorsYouFollow,
  getUserProfile,
  getWhoToFollow,
  handleFollowUnfollowUser,
  handleUpdateUserProfile,
} from "../controllers/userController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const userRouter = express.Router();

userRouter.get("/suggested-users", verifyJWT, getWhoToFollow);
userRouter.get("/creators-for-you", verifyJWT, getCreatorsForYou);
userRouter.get("/you-follow", verifyJWT, getCreatorsYouFollow);
userRouter.get("/:username", verifyJWT, getUserProfile);
userRouter.put("/follow/:userId", verifyJWT, handleFollowUnfollowUser);
userRouter.put("/update-profile", verifyJWT, handleUpdateUserProfile);

export default userRouter;

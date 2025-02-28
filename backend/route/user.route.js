import express from "express";
import { editProfile, foloworUnfollow, getOtherUser, getProfile, LoginRoute, logoutUser, registeruser } from "../controllor/user.controllor.js";
import isauthenticaed from "../middelware/atuhentication.js";
import upload from "../util/multer.js";

const router = express.Router();


router.post("/register", registeruser);
router.post("/login", LoginRoute);
router.get("/logout", logoutUser);
router.post("/update", isauthenticaed, upload.single('profilePicture'), editProfile);
router.get("/other", isauthenticaed, getOtherUser);
router.get("/getProfile/:id", isauthenticaed, getProfile);
router.get("/followunfollow/:id", isauthenticaed, foloworUnfollow);


export default router

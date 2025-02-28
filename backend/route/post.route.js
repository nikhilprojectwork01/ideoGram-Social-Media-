import express from "express";
import isauthenticaed from "../middelware/atuhentication.js";
import upload from "../util/multer.js";
import { addingComment, BookMark, deletePost, dislikePost, getAllpost, getCommentsOfPost, getofCurrentUser, likePost, PostImage } from "../controllor/post.controllor.js";
const router = express.Router();


router.post("/addPost", isauthenticaed, upload.single('image'), PostImage);
router.get("/getAllpost", isauthenticaed, getAllpost);
router.get("/getPostUser", isauthenticaed, getofCurrentUser);
router.get("/:id/like", isauthenticaed, likePost);
router.get("/:id/dislike", isauthenticaed, dislikePost);
router.post("/addingComment/:id", isauthenticaed, addingComment);
router.get("/getComments/:id", isauthenticaed, getCommentsOfPost);
router.delete("/deletePost/:id", isauthenticaed, deletePost);
router.get("/BookMark/:id", isauthenticaed, BookMark)



export default router
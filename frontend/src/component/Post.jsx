/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegHeart,
} from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import { IoBookmarkOutline } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Flag, MoreHorizontal, TypeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CommentDailogue from "./CommentDailogue";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";
import { setPost, setselectedPost } from "@/redux/postslice";
import { setUser } from "@/redux/userAuthslice";
import { Link } from "react-router";

export default function Post({ item }) {
  const { user } = useSelector((store) => store.userAuth);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const { post } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [follow, setfollow] = useState(
    user.following.includes(item?.author._id) ? true : false
  );
  const [liked, setLike] = useState(
    item?.likes.includes(user?._id) ? true : false
  );
  const [countLike, setCountLike] = useState(item?.likes?.length);
  const [postComment, setPostComment] = useState(item?.comments);
  useEffect(() => {
    setPostComment([...postComment]);
  }, []);
  const handleComment = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setComment(inputText);
    } else {
      setComment("");
    }
  };
  let [added, setadded] = useState(
    user?.bookmarks?.includes(item?._id) ? true : false
  );
  const HandleLike = async () => {
    try {
      const action = liked ? "dislike" : "like ";
      const res = await axios.get(
        `http://localhost:8080/api/v1/post/${item._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updateLike = liked ? countLike - 1 : countLike + 1;
        setCountLike(updateLike);
        setLike(!liked);
        // update it on our Redux
        const updatePostData = post.map((p) =>
          p._id === item._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPost(updatePostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const commentHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/post/addingComment/${item._id}`,
        { text: comment },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedcomment = [...postComment, res.data.return_comment];
        setPostComment(updatedcomment);
        const updateCommentOnpost = post.map((p) =>
          p._id === item._id ? { ...p, comments: updatedcomment } : p
        );
        dispatch(setPost(updateCommentOnpost));
        toast.success(res.data.message);
      }
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const DeleteHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/post//deletePost/${item._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = post.filter(
          (postItem) => postItem?._id !== item?._id
        );
        dispatch(setPost(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleBookMark = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/post/BookMark/${item._id}`,
        { withCredentials: true }
      );
      console.log(res);
      if (res.data.success) {
        dispatch(setUser(res.data.newuser));
        toast.success(res.data.message);
        setadded(!added);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="outer-div my-8 border-2 border-slate-100 rounded-md ">
        <div className="user-header flex justify-between my-2 m-2">
          <Link to={`/profile/${item?.author?._id}`}>
            <div className="name-avatar-section  flex flex-row items-center justify-between mb-2">
              <Avatar>
                <AvatarImage
                  src={
                    item?.author?.profilePicture === ""
                      ? "https://thumbs.dreamstime.com/b/no-account-sign-delete-cancel-social-media-profile-vector-symbol-wrong-person-icon-isolated-white-background-eps-337676667.jpg"
                      : item?.author?.profilePicture
                  }
                  className="rounded-xl h-8 w-8 "
                />
                <AvatarFallback>N/A</AvatarFallback>
              </Avatar>
              <p>@{item?.author?.username}</p>
              {user._id === item?.author?._id ? (
                <Badge variant="secondary" className="ml-4 text-blue-700">
                  Author
                </Badge>
              ) : null}
            </div>
          </Link>
          <Dialog>
            <DialogTrigger>
              <MoreHorizontal />
            </DialogTrigger>
            <DialogContent>
              <div className="mt-2 flex flex-col">
                {user?._id === item?.author?._id ? null : follow ? (
                  <Button
                    variant="outline"
                    className="my-2 text-[#ED4959] cursor-pointer"
                  >
                    unfollow
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="my-2 text-[#ED4959] cursor-pointer"
                  >
                    follow
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="my-2 text-[#ED4959] cursor-pointer"
                  onClick={handleBookMark}
                >
                  BookMark
                </Button>
                {user && user._id === item?.author?._id ? (
                  <Button
                    variant="outline"
                    className="my-2 text-[#ED4959] cursor-pointer"
                    onClick={DeleteHandler}
                  >
                    Delete
                  </Button>
                ) : null}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="post-sections m-2">
          <img
            className="rounded-sm aspect-square object-cover h-full"
            src={item?.image}
            alt="post image"
          />
        </div>
        <div className="footer-section m-2 flex flex-col">
          <div className="flex justify-between">
            <div className="like flex">
              {liked ? (
                <FaHeart
                  onClick={HandleLike}
                  size={"24"}
                  className="cursor-pointer text-red-600"
                />
              ) : (
                <FaRegHeart
                  onClick={HandleLike}
                  size={"22px"}
                  className="cursor-pointer hover:text-gray-600"
                />
              )}
              <FaRegComment
                onClick={() => {
                  dispatch(setselectedPost(item));
                  setOpen(true);
                }}
                className="ml-6 text-2xl cursor-pointer"
              />
            </div>
            <div className="likes flex flex-col items-center cursor-pointer">
              {added ? (
                <FaBookmark
                  className="text-2xl cursor-pointer"
                  onClick={handleBookMark}
                />
              ) : (
                <FaRegBookmark
                  className="text-2xl cursor-pointer"
                  onClick={handleBookMark}
                />
              )}
            </div>
          </div>
          <div className="like my-1">
            <p className="font-medium">{countLike} Likes</p>
          </div>
          <div className="form-section flex flex-col">
            <p className="cursor-pointer">
              <b>@{item?.author?.username}</b> {item?.caption}
            </p>
            <p
              className="text-gray-300 cursor-pointer mb-2"
              onClick={() => {
                dispatch(setselectedPost(item));
                setOpen(true);
              }}
            >
              {postComment?.length === 0
                ? "No Commment"
                : `Show All ${postComment?.length} comments`}
            </p>
            <div className="flex items-center justify-between my-2">
              <input
                type="text"
                name="comment"
                value={comment}
                placeholder="Add a comment..."
                className="outline-none text-sm w-full"
                onChange={handleComment}
              />
              {comment && (
                <span
                  onClick={commentHandler}
                  className="text-[#3BADF8] cursor-pointer"
                >
                  Post
                </span>
              )}
            </div>
          </div>
        </div>
        <CommentDailogue open={open} setOpen={setOpen} />
      </div>
    </>
  );
}

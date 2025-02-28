import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "@/redux/postslice";
import { toast } from "sonner";
import store from "@/redux/store";
import SelectedComment from "./selectedComment";

export default function CommentDailogue({ open, setOpen }) {
  const { selectedPost } = useSelector((store) => store.post);
  const { post } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [postComment, setPostComment] = useState([]);
  const [comment, setComment] = useState("");
  useEffect(() => {
    setPostComment(selectedPost?.comments);
  }, [selectedPost]);

  const handleComment = (e) => {
    setComment(e.target.value);
  };
  const commentHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/post/addingComment/${selectedPost?._id}`,
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
          p._id === selectedPost?._id ? { ...p, comments: updatedcomment } : p
        );
        dispatch(setPost(updateCommentOnpost));
        toast.success(res.data.message);
      }
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="max-w-5xl p-0 flex flex-1 h-[45%] flex-row justify-around items-center border-none"
        >
          <div className="main-dailogue-section flex flex-row flex-1  h-full">
            {" "}
            {/*outer comment*/}
            {/*Left comment*/}
            <div className="left-side w-1/2">
              <img
                src={selectedPost?.image}
                alt="user Image"
                className="h-full w-full object-cover rounded-l-md"
              />
            </div>
            {/*Right comment*/}
            <div className="right-side flex flex-col  w-[50%] p-2 m-1">
              {/*Right  USer comment*/}
              <div className="user-post-owner flex justify-between ">
                <div className="name-avatar-section  flex w-[30%] justify-between">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={
                        selectedPost?.author?.profilePicture === ""
                          ? "https://thumbs.dreamstime.com/b/no-account-sign-delete-cancel-social-media-profile-vector-symbol-wrong-person-icon-isolated-white-background-eps-337676667.jpg"
                          : selectedPost?.author?.profilePicture
                      }
                    />
                    <AvatarFallback>N/A</AvatarFallback>
                  </Avatar>
                  <p>{selectedPost?.author?.username}</p>
                </div>
                <Dialog>
                  <DialogTrigger>
                    <MoreHorizontal />
                  </DialogTrigger>
                  <DialogContent>
                    <div className="mt-2 flex flex-col">
                      <Button
                        variant="outline"
                        className="my-2 text-[#ED4959] cursor-pointer"
                      >
                        follow
                      </Button>
                      <Button
                        variant="outline"
                        className="my-2 text-[#ED4959] cursor-pointer"
                      >
                        unfollow
                      </Button>
                      <Button
                        variant="outline"
                        className="my-2 text-[#ED4959] cursor-pointer"
                      >
                        Block
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {/*Right Comment comment*/}
              <div className="users-commment overflow-auto">
                {postComment?.map((item) => (
                  <SelectedComment key={item._id} data={item} />
                ))}
              </div>
              {/*Right Add New comment*/}
              <div className="add-comment-form-section mt-auto">
                <div className="flex items-center justify-between my-2">
                  <input
                    type="text"
                    name="comment"
                    value={comment}
                    placeholder="Add a comment..."
                    className="outline-none text-sm w-full border-b-2 border-b-slate-600"
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

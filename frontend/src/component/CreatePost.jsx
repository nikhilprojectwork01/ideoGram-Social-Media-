import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { readFileAsDataURL } from "@/utils/PreviewImage";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router";
import useGetAllPost from "@/hook/useGetAllPost";
import { setPost } from "@/redux/postslice";

export default function CreatePost({ open, setOpen }) {
  const { user } = useSelector((store) => store.userAuth);
  const { post } = useSelector((store) => store.post);
  const inageRef = useRef();
  const [caption, setcaption] = useState("");
  const [image, setimage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleCaption = (e) => {
    setcaption(e.target.value);
  };
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setimage(file);
      const dataURL = await readFileAsDataURL(file); // we have to create this function in utils folder
      setPreview(dataURL);
    }
  };

  const CreatePostHandler = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("caption", caption);
    if (preview) {
      formdata.append("image", image);
    }
    try {
      setloading(true);
      const res = await axios.post(
        "http://localhost:8080/api/v1/post/addPost",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setPost([res.data.retunrdata, ...post]));
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage
              src={
                user?.profilePicture === ""
                  ? "https://thumbs.dreamstime.com/b/no-account-sign-delete-cancel-social-media-profile-vector-symbol-wrong-person-icon-isolated-white-background-eps-337676667.jpg"
                  : user?.profilePicture
              }
              className="h-8 w-8 rounded-2xl"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600 text-xs">
              {user?.bio === "" ? "No Bio........" : user?.bio}
            </span>
          </div>
        </div>
        <Textarea
          name="caption"
          value={caption}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
          onChange={handleCaption}
        />
        {preview && (
          <div className="w-full h-45 flex items-center">
            <img
              src={preview}
              alt="preview image"
              className="object-fit  rounded-xl  h-full w-full"
            />
          </div>
        )}
        <input
          ref={inageRef}
          name="image"
          type="file"
          className="hidden"
          onChange={handleFile}
        />
        <Button
          onClick={() => inageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] "
        >
          Select from computer
        </Button>
        {preview &&
          (loading ? (
            <Button className="bg-[#209536] hover:bg-[#2c791f]">
              <Loader2 className="h-4 w-4 mr-4 animate-spin" />
              Posting
            </Button>
          ) : (
            <Button
              onClick={CreatePostHandler}
              className="bg-[#41f162] hover:bg-[#2c791f]"
              type="submit"
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
}

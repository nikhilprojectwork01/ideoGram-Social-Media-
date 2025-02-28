import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/userAuthslice";

export default function EditProfile() {
  const imageref = useRef();
  const { user } = useSelector((store) => store.userAuth);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editdata, seteditData] = useState({
    bio: user?.bio,
    gender: user?.gender,
    profilePicture: user?.profilePicture,
  });

  const finlehandler = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      seteditData({ ...editdata, profilePicture: file });
    }
    console.log(file);
  };

  const handleinput = (e) => {
    seteditData({ ...editdata, bio: e.target.value });
  };

  const selectInputChnage = (value) => {
    seteditData({ ...editdata, gender: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("bio", editdata.bio);
    formdata.append("gender", editdata.gender);
    if (editdata.profilePicture) {
      formdata.append("profilePicture", editdata.profilePicture);
    }
    try {
      setloading(true);
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/update",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updateData = {
          ...user,
          bio: res?.data?.user?.bio,
          profilePicture: res?.data?.user?.profilePicture,
        };
        toast.success(res.data.message);
        dispatch(setUser(updateData));
        navigate(`/profile/${user?._id}`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <div className="m-auto max-w-3xl p-10 mt-10 flex flex-col justify-around h-[70vh] align-baseline">
        <h1 className="font-bold underline text-xl">Edit Profile</h1>
        <div className="bg-gray-400 rounded-xl p-4 flex flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${user?._id}`}>
              <Avatar>
                <AvatarImage
                  src={
                    user?.profilePicture === ""
                      ? "https://thumbs.dreamstime.com/b/no-account-sign-delete-cancel-social-media-profile-vector-symbol-wrong-person-icon-isolated-white-background-eps-337676667.jpg"
                      : user?.profilePicture
                  }
                  className="h-10 w-10 rounded-full"
                />
                <AvatarFallback>N/A</AvatarFallback>
              </Avatar>
            </Link>
            <div className="text-white">
              <h1 className="font-semibold text-sm">{user?.username}</h1>
              <span className="text-sm">{user?.bio || "No bio added.."}</span>
            </div>
          </div>
          <input
            ref={imageref}
            type="file"
            name="profilePicture"
            className="hidden"
            onChange={finlehandler}
          />
          <Button
            onClick={() => imageref?.current.click()}
            className="bg-blue-500 text-white hover:bg-blue-900"
          >
            Change Profile
          </Button>
        </div>
        <div className="mt-5">
          <h1 className="font-bold  text-l">Bio</h1>
          <Textarea
            className="focus-visible:ring-transparent resize-none"
            name="bio"
            value={editdata.bio}
            onChange={handleinput}
          />
        </div>
        <div className="mt-5">
          <h1 className="font-bold  text-l">Gender</h1>
          <Select
            defaultValue={editdata.gender}
            onValueChange={selectInputChnage}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto mt-10">
          {loading ? (
            <Button
              type="submit"
              className="my-4 bg-blue-400 hover:bg-blue-500"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              please Wait Saving..
            </Button>
          ) : (
            <Button
              className="bg-blue-600 hover:bg-blue-500"
              onClick={handleSubmit}
            >
              Save Change
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

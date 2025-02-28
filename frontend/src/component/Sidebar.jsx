import {
  Compass,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Video,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import React, { use, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import userAuthslice, {
  setsuggesteduser,
  setUser,
  setuserprofile,
} from "@/redux/userAuthslice";
import CreatePost from "./CreatePost";
import { setPost, setselectedPost } from "@/redux/postslice";
import { Button } from "@/components/ui/button";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { setLikeNotification } from "@/redux/rtnSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import Searchs from "./Search";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [opensearch, setopesearch] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.userAuth);
  const dispatch = useDispatch();
  const { LikeNotification } = useSelector((store) => store.realTimeNoti);
  const [noti, setnoti] = useState(LikeNotification);
  const { messagelength } = useSelector((store) => store.message);
  console.log("message length" + messagelength);
  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/user/logout", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
        dispatch(setUser(null));
        dispatch(setPost([]));
        dispatch(setselectedPost(null));
        dispatch(setLikeNotification([]));
        dispatch(setuserprofile(null));
        dispatch(setsuggesteduser([]));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const sideBarItem = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <Search />,
      text: "Search",
    },
    {
      icon: <Compass />,
      text: "Explore",
    },
    {
      icon: <MessageCircle />,
      text: "Message",
    },
    {
      icon: <Heart />,
      text: "Notification",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: (
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={
              user?.profilePicture === ""
                ? "https://thumbs.dreamstime.com/b/no-account-sign-delete-cancel-social-media-profile-vector-symbol-wrong-person-icon-isolated-white-background-eps-337676667.jpg"
                : user?.profilePicture
            }
          />
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut />,
      text: "Logout",
    },
  ];
  const sidebarhandler = (text) => {
    if (text === "Logout") {
      handleLogout();
    } else if (text === "Create") {
      setOpen(true);
    } else if (text === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (text === "Home") {
      navigate("/");
    } else if (text === "Message") {
      navigate("/chat");
    } else if (text === "Search") {
      setopesearch(true);
    }
  };
  const handleNoti = () => {
    setnoti(null);
    dispatch(setLikeNotification([null]));
  };
  return (
    <div className="border-r border-gray-300 px-4 w-[16%] h-screen fixed top-0 left-0 z-10">
      <div className="flex flex-col justify-between">
        <h1 className="font-bold text-left text-2xl mt-2">IdeoGram</h1>
        <div>
          {sideBarItem.map((item, index) => {
            return (
              <div
                onClick={() => sidebarhandler(item.text)}
                key={index}
                className="flex p-4 my-3 items-center cursor-pointer hover:bg-gray-400 rounded-lg"
              >
                {item.icon}
                <span className="ml-4">{item.text}</span>

                {item.text === "Notification" && noti?.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className="rounded-full h-2 w-2 absolute bg-red-600 right-22 bottom-42"
                        size="icon"
                      ></Button>
                    </PopoverTrigger>
                    <PopoverContent className="mb-auto h-[20rem] overflow-y-auto scrollbar-hide">
                      <div>
                        {noti?.length === 0 ? (
                          <p>No new notification</p>
                        ) : (
                          noti?.map((notification) => {
                            return (
                              <div
                                key={notification.userId}
                                className="p-2 mt-2 border-2 border-gray-10 rounded-2xl flex items-center w-full"
                              >
                                <div className="h-10 w-10 rounded-2xl">
                                  <img
                                    src={notification.userDetail.profilePicture}
                                    alt=""
                                    className="h-full w-full rounded-xl"
                                  />
                                </div>
                                <p className="font-bold text-sm ml-2">
                                  {notification.userDetail.username}
                                </p>
                                <div className="flex items-center">
                                  <img
                                    width="24"
                                    height="24"
                                    src="https://img.icons8.com/material-rounded/24/FA5252/like--v1.png"
                                    alt="like--v1"
                                    className="ml-2"
                                  />{" "}
                                  <p> +1</p>
                                </div>
                              </div>
                            );
                          })
                        )}
                        <Button className="mt-5" onClick={() => handleNoti()}>
                          Clear
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
      <Searchs setopesearch={setopesearch} opesearch={opensearch} />
    </div>
  );
}

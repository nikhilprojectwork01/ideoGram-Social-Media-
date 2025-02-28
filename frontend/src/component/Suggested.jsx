import { Button } from "@/components/ui/button";
import { setLikeNotification } from "@/redux/rtnSlice";
import store from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "sonner";

export default function Suggested() {
  const { suggesteduser, user } = useSelector((store) => store.userAuth);
  const followunfollow = async (userid) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/user/followunfollow/${userid}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <div className="my-10">
        <div className="flex items-center justify-between text-sm">
          <h1 className="font-semibold text-gray-600">Suggested for you</h1>
          <span className="font-medium cursor-pointer">See All</span>
        </div>
        {suggesteduser?.map((users) => {
          return (
            <div
              key={users?._id}
              className="flex items-center justify-between my-5 border-2 border-gray-100 rounded-sm p-1"
            >
              <div className="flex items-center gap-2 ">
                <Link to={`/profile/${users?._id}`}>
                  <Avatar>
                    <AvatarImage
                      src={
                        users?.profilePicture === ""
                          ? "https://thumbs.dreamstime.com/b/no-account-sign-delete-cancel-social-media-profile-vector-symbol-wrong-person-icon-isolated-white-background-eps-337676667.jpg"
                          : users?.profilePicture
                      }
                      className="h-10 w-10 rounded-full"
                    />
                    <AvatarFallback>N/A</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <h1 className="font-semibold text-sm">{users?.username}</h1>
                  <span className="text-gray-600 text-sm">
                    {users?.bio || "No bio added.."}
                  </span>
                </div>
              </div>
              <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]">
                {users.followers.includes(user._id) ? (
                  <Button
                    variant="transparent"
                    onClick={() => followunfollow(users?._id)}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="transparent"
                    onClick={() => followunfollow(users?._id)}
                  >
                    Follow
                  </Button>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

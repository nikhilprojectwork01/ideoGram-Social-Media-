import { Badge } from "@/components/ui/badge";
import store from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { useSelector } from "react-redux";
import Suggested from "./Suggested";

export default function RishtSideBar() {
  const { user } = useSelector((store) => store.userAuth);
  return (
    <>
      <div className=" rounded-md  h-96 p-3 w-1/5 mt-10 mr-10 flex flex-col">
        <div className="border-2 border-gray-100 flex items-center w-full p-2 rounded-xl cursor-pointer">
          <Avatar>
            <AvatarImage
              src={
                user?.profilePicture === ""
                  ? "https://thumbs.dreamstime.com/b/no-account-sign-delete-cancel-social-media-profile-vector-symbol-wrong-person-icon-isolated-white-background-eps-337676667.jpg"
                  : user?.profilePicture
              }
              className="rounded-full w-18 h-12 image-fit object-cover"
            />
            <AvatarFallback>N/A</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-start ml-1  w-full">
            <p>@{user?.username}</p>
            <p className="text-sm text-gray-500">
              {user?.bio ? user?.bio : "No bio exist"}
            </p>
          </div>
          <Badge variant="secondary" className="text-blue-700">
            Author
          </Badge>
        </div>
        <div className="otherusers">
          <Suggested />
        </div>
      </div>
    </>
  );
}

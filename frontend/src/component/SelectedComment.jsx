import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@radix-ui/react-avatar";
import React from "react";

export default function SelectedComment({ data }) {
  console.log("selected comment data");
  console.log(data);
  console.log("selected comment end");
  return (
    <>
      <div className="my-2">
        <div className="flex gap-3 items-center border-2 border-gray-50 rounded-md p-2">
          <Avatar>
            <AvatarImage
              className="h-8 w-8 rounded-2xl"
              src={
                data?.author?.profilePicture === ""
                  ? "https://thumbs.dreamstime.com/b/no-account-sign-delete-cancel-social-media-profile-vector-symbol-wrong-person-icon-isolated-white-background-eps-337676667.jpg"
                  : data?.author?.profilePicture
              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="font-bold text-sm">
            {data?.author?.username}
            <span className="font-normal pl-1">{data?.text}</span>
          </h1>
        </div>
      </div>
    </>
  );
}

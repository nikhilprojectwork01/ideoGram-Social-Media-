import { Button } from "@/components/ui/button";
import store from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

export default function Message() {
  const scroll = useRef();
  const { user, selecteduser } = useSelector((store) => store.userAuth);
  const { message } = useSelector((store) => store.message);
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  return (
    <>
      <div className="overflow-y-auto flex-1 p-4">
        <div className="flex justify-center">
          <div className="flex flex-col items-center justify-center">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={
                  selecteduser?.profilePicture === ""
                    ? "https://thumbs.dreamstime.com/b/no-account-sign-delete-cancel-social-media-profile-vector-symbol-wrong-person-icon-isolated-white-background-eps-337676667.jpg"
                    : selecteduser?.profilePicture
                }
                className="h-15 w-15 rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span>{selecteduser?.username}</span>
            <Link to={`/profile/${selecteduser?._id}`}>
              <Button className="h-8 my-2" variant="secondary">
                View profile
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-3  h-full">
          {message.map((msg, index) => {
            return (
              <div
                ref={scroll}
                className={
                  msg.senderId === user._id
                    ? "ml-auto bg-gray-300 rounded-xl p-2"
                    : "mr-auto bg-slate-500 rounded-xl p-2"
                }
                key={index}
              >
                {msg.message}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

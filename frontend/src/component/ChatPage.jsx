import { setselecteduser } from "@/redux/userAuthslice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Flag } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoSend } from "react-icons/io5";
import Message from "./Message";
import { toast } from "sonner";
import axios from "axios";
import { setMessage, setmessagelength } from "@/redux/ChatSlice";
import useGetAllMessage from "@/hook/useGetAllMessage";
import useGetRealTM from "@/hook/useGetRealTM";
import store from "@/redux/store";

export default function ChatPage() {
  useGetAllMessage();
  useGetRealTM();
  const dispatch = useDispatch();
  const { user, suggesteduser, selecteduser } = useSelector(
    (store) => store.userAuth
  );
  const { message } = useSelector((store) => store.message);
  const { onlineuser } = useSelector((store) => store.socket);
  const [input, setInput] = useState("");
  const handleOnchange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/message/sendmessage/${selecteduser._id}`,
        { message: input },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(setMessage([...message, res.data.newmessages]));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setInput("");
  };
  useEffect(() => {
    return () => {
      dispatch(setselecteduser(null));
    };
  }, []);
  return (
    <>
      <div className="chat-div ml-[16%]  flex h-screen p-10">
        <div className="left-div w-[30%] border-r-2 border-r-gray-200">
          <div className="border-b-2 border-b-gray-200 p-4 flex flex-col justify-between h-[25%]">
            <h1 className="font-bold text-xl">{user?.username}</h1>
            <Link to={`/profile/${user?._id}`}>
              <Avatar>
                <AvatarImage
                  src={
                    user?.profilePicture === ""
                      ? "https://thumbs.dreamstime.com/b/no-account-sign-delete-cancel-social-media-profile-vector-symbol-wrong-person-icon-isolated-white-background-eps-337676667.jpg"
                      : user?.profilePicture
                  }
                  className="h-16 w-16 rounded-full my-2"
                />
                <span>{user?.bio}</span>
                <AvatarFallback>N/A</AvatarFallback>
              </Avatar>
            </Link>
          </div>
          {suggesteduser?.map((user) => {
            const isonline = onlineuser.includes(user?._id);
            return (
              <div
                key={user?._id}
                className="flex items-center justify-between my-5 border-2 border-gray-100 rounded-xl p-1 mx-2 cursor-pointer hover:bg-gray-300"
                onClick={() => {
                  dispatch(setselecteduser(user));
                }}
              >
                <div className="flex items-center gap-2 ">
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
                  <div>
                    <h1 className="font-semibold text-sm">{user?.username}</h1>
                    <span className="text-gray-600 text-sm">
                      {isonline ? (
                        <p className="text-green-600 font-bold">Online</p>
                      ) : (
                        <p className="text-red-700 font-bold">Offline</p>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="right-div w-full">
          {selecteduser ? (
            <div className="flex flex-col h-full w-full items-center justify-between p-4">
              <div className=" p-2 w-full flex items-center bg-gray-100 rounded-xl">
                <Avatar className="ml-5">
                  <AvatarImage
                    src={
                      selecteduser?.profilePicture === ""
                        ? "https://thumbs.dreamstime.com/b/no-account-sign-delete-cancel-social-media-profile-vector-symbol-wrong-person-icon-isolated-white-background-eps-337676667.jpg"
                        : selecteduser?.profilePicture
                    }
                    className="h-10 w-10 rounded-full"
                  />
                  <AvatarFallback>N/A</AvatarFallback>
                </Avatar>
                <div className="ml-5">
                  <h1 className="font-semibold text-sm">
                    {selecteduser?.username}
                  </h1>
                </div>
              </div>
              <div className="w-full overflow-auto scrollbar-hide my-5 h-full">
                <Message info={selecteduser} />
              </div>
              <div className="mt-full w-full rounded-xl  flex items-center justify-between border-2 border-gray-100 bg-gray-100">
                <Input
                  type="text"
                  placeholder="Type a message"
                  name="message"
                  value={input}
                  onChange={handleOnchange}
                  className="focus-visible:ring-transparent  border-none"
                />
                <Button
                  variant="primary"
                  className="w-20 h-10"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Send <IoSend />
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full  w-full  flex items-center justify-center flex-col">
              <TbMessageChatbotFilled className="h-32 w-32" />
              <h1 className="text-2xl font-bold">Select a user to chat</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

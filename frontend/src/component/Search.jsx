import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { setsearchName } from "@/redux/userAuthslice";
import store from "@/redux/store";
import Suggested from "./Suggested";
import { Link } from "react-router"; // Ensure you are importing from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

export default function Searchs({ opesearch, setopesearch }) {
  const { suggesteduser, searchName, user } = useSelector(
    (store) => store.userAuth
  );
  const [filterdata, setfilterData] = useState(null);
  const dispatch = useDispatch();
  const [input, setinput] = useState("");
  const hanldechnage = (e) => {
    setinput(e.target.value);
    dispatch(setsearchName(e.target.value));
  };
  console.log(filterdata);
  useEffect(() => {
    const filteruser =
      suggesteduser?.length >= 0 &&
      suggesteduser.filter((data) => {
        if (!searchName) {
          return null;
        }
        return data?.username?.toLowerCase().includes(searchName.toLowerCase());
      });
    setfilterData(filteruser);
  }, [suggesteduser, searchName]);
  return (
    <>
      <Dialog open={opesearch}>
        <DialogContent
          onInteractOutside={() => setopesearch(false)}
          className="h-[60%] w-[50%]"
        >
          <div className="p-5">
            <Input
              type="text"
              placeholder="Enter User Name"
              value={input}
              onChange={hanldechnage}
            />

            {filterdata &&
              filterdata?.map((data) => (
                <Link to={`/profile/${data?._id}`} key={data?._id}>
                  <div
                    className="flex items-center justify-between border-2 border-gray-200 rounded-sm p-1 h-16 mt-5"
                    onClick={() => setopesearch(false)}
                  >
                    <div className="flex items-center gap-2 ">
                      <Avatar>
                        <AvatarImage
                          src={
                            data?.profilePicture === ""
                              ? "https://thumbs.dreamstime.com/b/no-account-sign-delete-cancel-social-media-profile-vector-symbol-wrong-person-icon-isolated-white-background-eps-337676667.jpg"
                              : data?.profilePicture
                          }
                          className="h-10 w-10 rounded-full"
                        />
                        <AvatarFallback>N/A</AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="font-semibold text-sm">
                          {data?.username}
                        </h1>
                        <span className="text-gray-600 text-sm">
                          {data?.bio || "No bio added.."}
                        </span>
                      </div>
                    </div>
                    <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]">
                      {data?.followers?.includes(user._id) ? (
                        <Button variant="transparent">Unfollow</Button>
                      ) : (
                        <Button variant="transparent">Follow</Button>
                      )}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

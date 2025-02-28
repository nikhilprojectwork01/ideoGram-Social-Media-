import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useGetUserProfile from "@/hook/useGetUserProfile";
import { setfollow } from "@/redux/followSlice";
import store from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import { AtSign, Flag, Heart, MessageCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

export default function Profile() {
  const dispatch = useDispatch();
  const params = useParams();
  const userid = params.id;
  useGetUserProfile(userid);
  const { userprofile, user } = useSelector((store) => store.userAuth);
  const { suggesteduser } = useSelector((store) => store.userAuth);
  const isLoggedInUserProfile = userprofile?._id === user._id ? true : false;
  const [active, setactive] = useState("Post");
  const handleTabChange = (value) => {
    setactive(value);
  };
  const displayPost =
    active === "Post" ? userprofile?.posts : userprofile?.bookmarks;

  const followunfollow = async () => {
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
  const [isfollow, setisfollow] = useState(
    userprofile?.followers?.includes(user._id)
  );
  useEffect(() => {
    if (userprofile?.followers?.includes(user._id)) {
      setisfollow(true);
    } else {
      setisfollow(false);
    }
  }, [userprofile, user]);
  return (
    <>
      <div className="flex max-w-5xl justify-center mx-auto pl-10">
        <div className="flex flex-col gap-20 p-8 mt-5 ml-16">
          <div className="grid grid-cols-2  mt-5 ml-16">
            <section className="flex items-center justify-center  w-[80%]">
              <Avatar>
                <AvatarImage
                  src={
                    userprofile?.profilePicture === ""
                      ? "https://thumbs.dreamstime.com/b/no-account-sign-delete-cancel-social-media-profile-vector-symbol-wrong-person-icon-isolated-white-background-eps-337676667.jpg"
                      : userprofile?.profilePicture
                  }
                  className="h-18 w-18 rounded-full object-contain"
                />
                <AvatarFallback>N/A</AvatarFallback>
              </Avatar>
            </section>
            <section>
              <div className="flex flex-col gap-5 mt-5">
                <div className="flex items-center gap-2">
                  <span>@{userprofile?.username}</span>
                  {isLoggedInUserProfile ? (
                    <>
                      <Link to="/edit/profile">
                        <Button
                          variant="secondary"
                          className="hover:bg-gray-200 h-8"
                        >
                          Edit profile
                        </Button>
                      </Link>
                    </>
                  ) : isfollow ? (
                    <>
                      <Button
                        variant="secondary"
                        className="bg-[#387197] text-white hover:bg-[#51baffdb] h-8"
                        onClick={followunfollow}
                      >
                        Unfollow
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-[#387197] text-white hover:bg-[#51baffdb] h-8"
                      >
                        Message
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="bg-[#387197] text-white hover:bg-[#51baffdb]"
                      onClick={followunfollow}
                    >
                      follow
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <p>
                    <span className="font-semibold">
                      {userprofile?.posts.length}{" "}
                    </span>
                    posts
                  </p>
                  <p>
                    <span className="font-semibold">
                      {userprofile?.followers.length}{" "}
                    </span>
                    followers
                  </p>
                  <p>
                    <span className="font-semibold">
                      {userprofile?.following.length}{" "}
                    </span>
                    following
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">
                    {userprofile?.bio || "bio here..."}
                  </span>
                  <Badge className="w-fit rounded-lg" variant="secondary">
                    <AtSign />{" "}
                    <span className="pl-1">{userprofile?.username}</span>{" "}
                  </Badge>
                  <span>🤯 Working On Project</span>
                  <span>🤯Turing code into fun</span>
                  <span>🤯 Mern Dveloper</span>
                </div>
              </div>
            </section>
          </div>
          <div className="border-t border-t-gray-200">
            <div className="flex items-center justify-center gap-10 text-sm">
              <span
                className={`py-3 cursor-pointer ${active === "Post" ? "font-bold" : ""}`}
                onClick={() => handleTabChange("Post")}
              >
                POSTS
              </span>
              {isLoggedInUserProfile && (
                <span
                  className={`py-3 cursor-pointer ${active === "saved" ? "font-bold" : ""}`}
                  onClick={() => handleTabChange("saved")}
                >
                  SAVED
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {displayPost?.map((post) => {
                return (
                  <div
                    key={post?._id}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={post.image}
                      alt="postimage"
                      className="rounded-sm my-2 w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center text-white space-x-4">
                        <button className="flex items-center gap-2 hover:text-gray-300">
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-gray-300">
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

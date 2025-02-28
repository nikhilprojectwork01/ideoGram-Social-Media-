import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";
import store from "@/redux/store";

export default function Posts() {
  const { post } = useSelector((store) => store.post);
  return (
    <>
      <div className="w-[40%]">
        {post?.map((item) => (
          <Post key={item?._id} item={item} />
        ))}
      </div>
    </>
  );
}

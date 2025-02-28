import React from "react";
import Feed from "./feed";
import { Outlet } from "react-router";
import RishtSideBar from "./RishtSideBar";
import useGetAllPost from "@/hook/useGetAllPost";
import useGetSuggestedUser from "@/hook/useGetSuggestedUser";

export default function Home() {
  useGetAllPost();
  useGetSuggestedUser();
  return (
    <div className=" flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RishtSideBar />
    </div>
  );
}

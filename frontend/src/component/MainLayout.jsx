import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div>
      <Sidebar />
      <Outlet></Outlet>
    </div>
  );
}

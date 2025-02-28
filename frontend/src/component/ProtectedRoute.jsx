import store from "@/redux/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const { user } = useSelector((store) => store.userAuth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);
  return <>{children}</>;
}

import { setsuggesteduser } from "@/redux/userAuthslice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useGetSuggestedUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    const getSuggested = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/user/other`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setsuggesteduser(res.data.otherUser));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSuggested();
  }, []);
}

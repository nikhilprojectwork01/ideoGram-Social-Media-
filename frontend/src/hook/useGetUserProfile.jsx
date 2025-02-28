import { setuserprofile } from "@/redux/userAuthslice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useGetUserProfile(userId) {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/user/getProfile/${userId}`,
          { withCredentials: true }
        );

        if (res?.data?.success) {
          dispatch(setuserprofile(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userId]);
}

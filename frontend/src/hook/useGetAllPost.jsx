import { setPost } from "@/redux/postslice";
import store from "@/redux/store";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useGetAllPost() {
  const { post } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.userAuth);
  const dispatch = useDispatch();
  return useEffect(() => {
    const fetchalldata = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/post/getAllpost",
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setPost(res.data.post));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchalldata();
  }, []);
}

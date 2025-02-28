import { setMessage } from "@/redux/ChatSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useGetAllMessage() {
  const { selecteduser } = useSelector((store) => store.userAuth);
  const dispatch = useDispatch();
  useEffect(() => {
    const getallmessage = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/message/getmessage/${selecteduser._id}`,
          { withCredentials: true }
        );
        if (res?.data?.success) {
          dispatch(setMessage(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getallmessage();
  }, [selecteduser]);
}

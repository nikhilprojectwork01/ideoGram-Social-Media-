import { setMessage, setmessagelength } from "@/redux/ChatSlice";
import store from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useGetRealTM() {
  const { socket } = useSelector((store) => store.socket);
  const { message } = useSelector((store) => store.message);
  const dispatch = useDispatch();
  useEffect(() => {
    socket?.on("newmessage", (newmessage) => {
      dispatch(setMessage([...message, newmessage]));
    });
    return () => {
      socket?.off("newmessage");
    };
  }, [message, setMessage]);
}

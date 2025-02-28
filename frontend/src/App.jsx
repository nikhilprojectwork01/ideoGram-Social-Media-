import { createBrowserRouter, RouterProvider } from "react-router";
import Signup from "./component/signup";
import Login from "./component/login";
import Home from "./component/Home";
import MainLayout from "./component/MainLayout";
import Profile from "./component/Profile";
import EditProfile from "./component/EditProfile";
import ChatPage from "./component/ChatPage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { setonlineuser, setSocket } from "./redux/SocketSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoute from "./component/protectedRoute";
const approuter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            {" "}
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit/profile",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
export default function App() {
  const { user } = useSelector((store) => store.userAuth);
  const { socket } = useSelector((store) => store.socket);
  console.log(socket);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socket = io("http://localhost:8080", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socket));

      socket.on("getOnlineUsers", (onlineUser) => {
        dispatch(setonlineuser(onlineUser));
      });
      socket.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });
      return () => {
        socket.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={approuter} />
    </>
  );
}

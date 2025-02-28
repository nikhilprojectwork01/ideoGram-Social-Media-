import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";

export default function Signup() {
  const [loading, setloading] = useState(false);
  const { user } = useSelector((store) => store.userAuth);
  const navigate = useNavigate();
  const [input, setinput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handlechange = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const response = await axios.post(
        "http://localhost:8080/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
        setinput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <div className="flex items-center w-screen h-screen justify-center">
        <form
          onSubmit={handleSubmit}
          className="shadow-lg flex flex-col gap-5 p-8 w-1/3"
        >
          <div className="my-4 items-center flex flex-col">
            <img
              className="h-16 w-30"
              src="https://5.imimg.com/data5/SELLER/Default/2024/9/451019279/TC/LH/HV/11701680/ideogram-ai-software-500x500.png"
              alt="logo"
            />
            <h1 className="text-sm text-center mt-4">
              <b>Signup</b>
            </h1>
          </div>
          <div>
            <span className="font-medium">Username</span>
            <Input
              type="text"
              name="username"
              value={input.username}
              onChange={handlechange}
              className="focus-visible:ring-transparent my-2"
            />
          </div>
          <div>
            <span className="font-medium">Email</span>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={handlechange}
              className="focus-visible:ring-transparent my-2"
            />
          </div>
          <div>
            <span className="font-medium">Password</span>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={handlechange}
              className="focus-visible:ring-transparent my-2"
            />
          </div>
          {loading ? (
            <Button type="submit" className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              please Wait
            </Button>
          ) : (
            <Button>Signup</Button>
          )}
          <span className="text-sm  w-2/3 ml-32">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </>
  );
}

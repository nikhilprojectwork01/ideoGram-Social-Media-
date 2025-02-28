import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDb from "./util/db.js";
import userRoute from "./route/user.route.js"
import postRoute from "./route/post.route.js"
import mesageRoute from "./route/message.route.js"
import { app, server, io } from "./socket/socket.js";
import path from "path"
dotenv.config();
const port = process.env.PORT || 3000
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
}
app.use(cors(corsOptions));
app.use(urlencoded({ extended: true }))



app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", mesageRoute)
app.use(express.static(path.join(__dirname, "/frontend/dist")))
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
})

server.listen(port, () => {
  connectDb();
  console.log("Connection Establish with the port ", port)
}) 
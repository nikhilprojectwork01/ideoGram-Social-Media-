import express from "express";
import isauthenticaed from "../middelware/atuhentication.js";
import { getAllmessage, sendmessage } from "../controllor/message.contollor.js";

const router = express.Router();

router.post("/sendmessage/:id", isauthenticaed, sendmessage);
router.get("/getmessage/:id", isauthenticaed, getAllmessage)

export default router
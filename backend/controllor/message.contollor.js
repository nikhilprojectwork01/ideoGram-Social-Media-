import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "./../socket/socket.js";

export const sendmessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    if (!message) {
      return res.status(404).json({
        message: "Enter Message",
        success: false
      })
    }

    let gotconversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    })

    if (!gotconversation) {
      gotconversation = await Conversation.create({
        participants: [senderId, receiverId]
      })
    }

    const newmessages = await Message.create({
      senderId,
      message,
      receiverId
    })

    if (newmessages) gotconversation.messages.push(newmessages._id)
    await Promise.all([gotconversation.save(), newmessages.save()])

    //socket io implementation 

    const reciersocketId = getReceiverSocketId(receiverId);
    if (reciersocketId) {
      io.to(reciersocketId).emit("newmessage", newmessages);
    }

    return res.status(200).json({
      success: true,
      message: "Message Sent Successfully",
      newmessages,
    })

  } catch (error) {
    console.log(error)
  }
}


//get all messages  :

export const getAllmessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate({
      path: 'messages'
    })

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: []
      })
    }
    return res.status(200).json({
      message: "Message fin successfull",
      messages: conversation?.messages,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}
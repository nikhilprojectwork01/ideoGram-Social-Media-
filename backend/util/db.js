import mongoose from "mongoose"


const connectDb = async()=>{
  try {
   await mongoose.connect(process.env.MONGOURI)
    console.log("Connection Establish With The Mongodb")
  } catch (error) {
    console.log(error)
  }
}


export default connectDb;
import jwt from "jsonwebtoken"

const isauthenticaed = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(201).json({
        message: "User Not Authenticated",
        success: true
      })
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(201).json({
        message: "Invalid Token",
        success: false
      })
    }
    req.id = decode.userId
    next();
  } catch (error) {
    console.log(error)
  }
}

export default isauthenticaed
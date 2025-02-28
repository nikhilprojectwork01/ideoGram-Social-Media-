import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import getDataUri from "../util/datauri.js";
import cloudinary from "../util/cloudinary.js";
import { Post } from "../models/post.model.js";

export const registeruser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Some Fields Are Missing",
        success: false
      })
    }

    const finduser = await User.findOne({ email });
    if (finduser) {
      return res.status(400).json({
        message: "Email Alredy Register",
        success: false
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword
    })


    return res.status(200).json({
      message: "User Register Successfully",
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}


//login route  


export const LoginRoute = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(401).json({
        message: "Some Fileds are Missing",
        success: false
      })
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        message: "Email Not Register",
        success: false
      })
    }

    const isPasswordMathced = await bcrypt.compare(password, user.password);
    if (!isPasswordMathced) {
      return res.status(401).json({
        message: "Please Enter Correct Password",
        success: false
      })
    }

    const tokendata = {
      userId: user._id
    }
    const token = await jwt.sign(tokendata, process.env.SECRET_KEY, { expiresIn: '1d' });

    const populatePost = await Promise.all(
      user.posts.map(async (postid) => {
        const post = await Post.findById(postid);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null
      })
    )

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      gender: user.gender,
      followers: user.followers,
      following: user.following,
      posts: populatePost,
    }

    return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
      message: `Welcome Back ${user.username}`,
      user,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}


// logout User
export const logoutUser = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout Successfully",
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}


// get profile  

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await User.findById(id).populate({
      path: "posts",
      createAt: -1
    }).populate({
      path: "bookmarks"
    });
    if (!users) {
      return res.status(400).json({
        message: "User Not Find",
        success: false
      })
    }
    return res.status(200).json({
      users,
      success: true
    })

  } catch (error) {
    console.log(error)
  }
}



//edit profile :


export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudresponce

    if (profilePicture) {
      const fileuri = getDataUri(profilePicture);
      cloudresponce = await cloudinary.uploader.upload(fileuri.content);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User Not Find",
        success: false
      })
    }

    if (bio) {
      user.bio = bio;
    }
    if (gender) {
      user.gender = gender
    }
    if (profilePicture) {
      user.profilePicture = cloudresponce.secure_url
    }

    await user.save();

    return res.status(200).json({
      message: "Profile Updated Successfully",
      user,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}

// get other users  

export const getOtherUser = async (req, res) => {
  try {
    const otherUser = await User.find({ _id: { $ne: req.id } }).select("-password");

    if (!otherUser) {
      return res.status(400).json({
        message: "No user FOund",
        success: false
      })
    }

    return res.status(200).json({
      success: true,
      message: "Other USer Find Successfully",
      otherUser
    })

  } catch (error) {
    console.log(error)
  }
}
// handling Follow and Unfollow : 
export const foloworUnfollow = async (req, res) => {
  try {
    const follower_id = req.id;
    const following_id = req.params.id;
    if (follower_id === following_id) {
      return res.status(400).json({
        message: "You Cannot Follow YourSelf",
        success: false
      })
    }
    const currentUser = await User.findById(follower_id);
    const targetUser = await User.findById(following_id)
    if (!currentUser) {
      return res.status(404).json({
        message: "User Not Found",
        success: false
      })
    }
    if (!targetUser) {
      return res.status(404).json({
        message: "User Not Found",
        success: false
      })
    }
    // check wether user  alredy Following Or not

    const isFollowing = await currentUser.following.includes(following_id);
    if (isFollowing) {
      //they are following now wehave to unfollow him'

      await Promise.all([
        // now we have Updated Current User 
        User.updateOne({ _id: follower_id }, { $pull: { following: following_id } }),
        // now we have to Update the  follwing User 
        User.updateOne({ _id: following_id }, { $pull: { followers: follower_id } })
      ])
      return res.status(200).json({
        message: 'Unfollow',
        success: true
      })
    } else {
      //not following now we have to follow himm prmise All is Used when you have to Update two collection simultaneously  
      await Promise.all([
        // now we have Updated Current User 
        User.updateOne({ _id: follower_id }, { $push: { following: following_id } }),
        // now we have to Update the  follwing User 
        User.updateOne({ _id: following_id }, { $push: { followers: follower_id } })
      ])
      return res.status(200).json({
        message: "Following",
        success: true
      })
    }

  } catch (error) {
    console.log(error)
  }
}
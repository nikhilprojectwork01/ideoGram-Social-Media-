import sharp from "sharp"
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import getDataUri from "../util/datauri.js";
import cloudinary from "../util/cloudinary.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const PostImage = async (req, res) => {
  try {
    const userid = req.id; //logedin user 
    const { caption } = req.body
    const image = req.file;
    if (!image) {
      return res.status(404).json({
        message: "Image Is Necessary",
        success: true
      })
    }

    //finding user  
    const owner = await User.findById(userid);

    if (!owner) {
      return res.status(404).json({
        message: "User not Authenticated",
        success: true
      })
    }

    //uploading Image  
    // since some files are too large to handle so we are using shrap to reduce the size of the file  for image optimization 

    const optimizedimageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();
    //buffer to data uri
    const fileuri = `data:image/jpeg;base64,${optimizedimageBuffer.toString('base64')}`;
    const cloudresponce = await cloudinary.uploader.upload(fileuri);
    const post = await Post.create({
      caption,
      image: cloudresponce.secure_url,
      author: owner._id
    })
    owner.posts.push(post._id)
    await owner.save();
    const retunrdata = await post.populate({ path: 'author', select: '-password' })
    return res.status(200).json({
      message: "Image Post Successfully",
      retunrdata,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}

//finding all the post
export const getAllpost = async (req, res) => {
  try {
    const post = await Post.find().sort({ createdAt: -1 }).populate({ path: "author", select: 'username  profilePicture' })
      .populate({
        path: "comments", sort: { createdAt: -1 },
        populate: ({
          path: 'author',
          select: 'username profilePicture'
        })
      });

    return res.status(200).json({
      message: "Image Find Successfully",
      post,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}


//  get post by id 
export const getofCurrentUser = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(404).json({
        message: "User Not LogedIn",
        success: false
      })
    }
    const post = await Post.find({ author: userId }).sort({ createdAt: -1 }).populate({
      path: "author",
      select: 'username, profilePicture',
    }).populate({
      path: 'comments',
      sort: { createdAt: -1 },
      populate: {
        path: 'author',
        select: 'username, profilePicture'
      }
    });
    if (!post) {
      return res.status(404).json({
        message: "No Post Yet",
        success: false
      })
    }
  } catch (error) {
    console.log(error)
  }
}


//like and dislike by user  :
export const likePost = async (req, res) => {
  try {
    const userid = req.id;
    const postid = req.params.id;
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({
        message: "Post Not Exist",
        success: true
      })
    }
    // $addToSet -> this will update like only by once if user tries to like another time it will not update them  
    await post.updateOne({ $addToSet: { likes: userid } });
    await post.save();

    //implementing  socket-io for rtu 
    const user = await User.findById(userid).select('username profilePicture');
    //now we are implementing that if the post own by the user then now show notification 
    const postowner = post.author.toString();
    if (postowner !== userid) {
      const notification = {
        type: "Like",
        userId: userid,
        userDetail: user,
        postid,
        message: "Your Post was Liked"
      }
      const postOwnerSocketId = getReceiverSocketId(postowner);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({
      message: "Liked",
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}


//disliking user 
export const dislikePost = async (req, res) => {
  try {

    const userid = req.id;
    const postid = req.params.id;
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({
        message: "Post Not Exist",
        success: true
      })
    }

    await post.updateOne({ $pull: { likes: userid } });
    await post.save();


    const user = await User.findById(userid).select('username profilePicture');
    const postowner = post.author.toString();
    if (postowner !== userid) {
      const notification = {
        type: "Dislike",
        userId: userid,
        userDetail: user,
        postid,
        message: "Your Post was DisLiked"
      }
      const postOwnerSocketId = getReceiverSocketId(postowner);
      io.to(postOwnerSocketId).emit("notification", notification);
    }


    return res.status(200).json({
      message: "DisLiked",
      success: true
    })

  } catch (error) {
    console.log(error)
  }
}


//adding Comment  :

export const addingComment = async (req, res) => {
  try {
    const userid = req.id;
    const postId = req.params.id;
    const { text } = req.body;
    const posts = await Post.findById(postId);
    if (!posts) {
      return res.status(404).json({
        message: "Post Not Exist",
        success: true
      })
    }

    if (!text) {
      return res.status(404).json({
        message: "Enter Commnet",
        success: false
      })
    }

    let comment = await Comment.create({
      text,
      author: userid,
      post: postId
    })
    const return_comment = await comment.populate({
      path: 'author',
      select: 'username  profilePicture'
    })

    posts.comments.push(comment._id);

    await posts.save();
    return res.status(200).json({
      message: "comment Added",
      return_comment,
      success: true
    })
  } catch (error) {
    console.log(error);
  }
}


export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');

    if (!comments) return res.status(404).json({ message: 'No comments found for this post', success: false });

    return res.status(200).json({ success: true, comments });

  } catch (error) {
    console.log(error);
  }
}



// delete post  : 

export const deletePost = async (req, res) => {
  try {
    const userid = req.id;
    const postId = req.params.id;

    const posts = await Post.findById(postId);
    if (!posts) {
      return res.status(400).json({
        message: "Post Not Find",
        success: false
      })
    }
    if (posts.author.toString() !== userid) {
      return res.status(403).json({
        message: "Unathorized User",
        success: true
      })
    }

    await Post.findByIdAndDelete(postId);

    //now post is deleted but you have to remove it from the user schema also 
    const user = await User.findById(userid);
    user.posts = user.posts.filter(id => id.toString() !== postId);
    await user.save();

    //deleting comment from the post  :
    await Comment.deleteMany({ post: postId });


    return res.status(200).json({
      message: "Post Deleted Successfully",
      success: true
    })



  } catch (error) {
    console.log(error)
  }
}



//bookmark save 

export const BookMark = async (req, res) => {
  try {
    const userId = req.id;
    const postid = req.params.id;
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(400).json({
        message: "Post Not Find",
        success: false
      })
    }
    const newuser = await User.findById(userId);
    if (newuser.bookmarks.includes(post._id)) {
      // it mins alredy Added to the bookmark 
      await newuser.updateOne({ $pull: { bookmarks: post._id } });
      await newuser.save();
      return res.status(200).json({
        type: 'unsave',
        newuser,
        message: "Post Removed Form the Bookmark",
        success: true
      })
    } else {
      await newuser.updateOne({ $push: { bookmarks: post._id } });
      await newuser.save();
      return res.status(200).json({
        type: 'save',
        newuser,
        message: "Added to Bookmark",
        success: true
      })
    }

  } catch (error) {
    console.log(error)
  }
}
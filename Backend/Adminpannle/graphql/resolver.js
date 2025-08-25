const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/model"); // mongoose model
const User = require('../../Models/user');
const Post = require('../../Models/post');
const Block = require('../model/block'); // mongoose model for blocked users
const mongoose = require("mongoose");
const Video = require('../../Models/Video'); // Assuming you have a Video model


const adminResolvers = {
  Query: {

    // all users
      allUsers: async () =>{
 return await User.countDocuments();  
      },  
    admin: async (_, { id }) => {
      return await Admin.findById(id);
    },
     // All total posts
    totalPosts: async () => {
      return await Post.countDocuments();
    },
    // block user' count
     BlockCount: async () => {
      return await Block.countDocuments();
    },
    // userlike count
     getUserLikedPosts: async (_, { userId }) => {
      try {
        // Ensure id is properly handled
        const posts = await Post.find({
            "likes.user": { $in: [new mongoose.Types.ObjectId(userId)] },
            imageUrl: { $ne: null }
        }).populate("likes", "_id username"); // sirf required fields populate karna

        return posts;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    getUserCommentedPosts: async (_, { userId }) => {
  try {
    const posts = await Post.find({
      "comments.user": userId,
      imageUrl: { $ne: null } 
    }).populate("createdBy", "username profilePic");

    return posts;
  } catch (error) {
    console.error("Error fetching user commented posts:", error);
    throw new Error("Failed to fetch user commented posts");
  }
},

getUserLikedVideos: async (_, { userId }) => {
  try {
    const videos = await Post.find({
      "likes.user": userId,
       videoUrl: { $ne: null } 
    }).populate("createdBy", "username ");

    return videos;
  } catch (error) {
    throw new Error(error.message); /* CR  */
  }
},

getUserLikedReels: async (_, { userId }) => {
  try {
    const videos = await Video.find({
      "likes.user": userId,
       videoUrl: { $ne: null } 
    }).populate("createdBy", "username ");

    return videos;
  } catch (error) {
    throw new Error(error.message); /* CR  */
  }
},


getUserCommentedVideos: async (_, { userId }) => {
  try {
    const videos = await Post.find({
      "comments.user": userId,
      videoUrl: { $ne: null }    // sirf videos
    });

    return videos;
  } catch (error) {
    throw new Error(error.message);
  }
},

getUserCommentedReels: async (_, { userId }) => {
  try {
    const videos = await Video.find({
      "comments.user": userId,
      videoUrl: { $ne: null }    // sirf videos
    });

    return videos;
  } catch (error) {
    throw new Error(error.message);
  }
}



  },

  Mutation: {
    // Register a new admin
    registerAdmin: async (_, { input }) => {
      const { firstname, lastname, email, password, phoneNumber } = input;

      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) throw new Error("Admin already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        firstname,
        lastname,
        email,
        phoneNumber,
        password: hashedPassword,
      });

      await newAdmin.save();

      const token = jwt.sign(
        { id: newAdmin._id, email: newAdmin.email },
        "SECRET_KEY",
        { expiresIn: "1d" }
      );

      return { token, admin: newAdmin };
    },

    // Login an existing admin
    loginAdmin: async (_, { input }) => {
      const { email, password } = input;

      const admin = await Admin.findOne({ email });
      if (!admin) throw new Error("Invalid email or password");

      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) throw new Error("Invalid email or password");

      const token = jwt.sign(
        { id: admin._id, email: admin.email },
        "SECRET_KEY",
        { expiresIn: "1d" }
      );

      return { token, admin };
    },
  },

  // block user 
  Mutation: {
    blockUser: async (_, { userId }) => {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      user.is_blocked = true;
      await Block.create({ userId: user._id });
     
      await user.save();

      return user;
    },

   unblockUser: async (_, { userId }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // User ko unblock karna
  user.is_blocked = false;

  // Block collection se entry remove karna
  await Block.deleteOne({ userId: user._id });

  await user.save();

  return user;
}

   
  },
 

  


};

module.exports = adminResolvers;

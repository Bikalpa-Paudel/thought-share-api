import { Request, Response } from "express";
import postModel from "../models/postModel";
import userModel from "../models/userModel";
import jwt from "jsonwebtoken";

export const createPost = async (req: Request, res: Response) => {
  const header = req.headers.authorization;
  console.log(header);

  if (!header) {
    return res.status(401).json({
      success: false,
      message: "Authorization failed",
    });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization failed",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

      if (typeof decodedToken !== "string") {
        console.log(decodedToken);
      const newPost = await postModel.create({
        title,
        content,
        user: decodedToken.id,
      });
      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        post: newPost,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  const posts = await postModel.find().populate("user", "username email");

  return res.status(200).json({
    success: true,
    posts,
  });
};

const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await postModel.findById(id).populate("user", "username email");

  return res.status(200).json({
    success: true,
    post,
  });
};

// const updatePost = async (req: Request, res: Response) => {
//   const header = req.headers.authorization;

//   if (!header) {
//     return res.status(401).json({
//       success: false,
//       message: "Authorization failed",
//     });
//   }

//   const token = header.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Authorization failed",
//     });
//   }

//   const user = await userModel.findOne({ token: token });

//   if (!user) {
//     return res.status(401).json({
//       success: false,
//       message: "Authorization failed",
//     });
//   }

//   const { id } = req.params;
//   const { title, content } = req.body;

//   const post = await postModel.findById(id);

//   if (!post) {
//     return res.status(404).json({
//       success: false,
//       message: "Post not found",
//     });
//   }

//   if (post.user.toString() !== user._id.toString()) {
//     return res.status(403).json({
//       success: false,
//       message: "You are not authorized to update this post",
//     });
//   }

//   post.title = title;
//   post.content = content;

//   await post.save();

//   return res.status(200).json({
//     success: true,
//     message: "Post updated successfully",
//     post,
//   });
// };

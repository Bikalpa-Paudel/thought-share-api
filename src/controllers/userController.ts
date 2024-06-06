import userModel from "../models/userModel";
import jwt from "jsonwebtoken";

export const getUsers = async (req: any, res: any) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Error!Token was not provided.",
    });
    return;
  }

  try {
    const decodedToken = jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET || "secret"
    );

    return res.status(200).json({ success: true, user: decodedToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
};

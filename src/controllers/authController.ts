import User from "../models/userModel";
import OTP from "../models/otpModel";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

export const signup = async (req: any, res: any) => {
  try {
    const { username, email, password, otp } = req.body;
    // Check if all details are provided
    if (!username || !email || !password || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
        otp: response[0].otp,
      });
    }

    // Secure password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Hashing password error for ${password}: ` + error,
      });
    }
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error });
  }
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  // Check if all details are provided

  if (!email || !password) {
    return res.status(403).json({
      success: false,
      message: "All fields are required",
    });
  }
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User does not exist",
    });
  }
  // Check if password is correct or not
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  // Create a token
  const token = jsonwebtoken.sign(
    { email: user.email, id: user._id },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token,
  });
};

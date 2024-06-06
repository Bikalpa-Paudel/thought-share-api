
import express from "express";
import {sendOTP} from "../controllers/otpController"
const router = express.Router();
router.post('/send-otp', sendOTP);
export default router;
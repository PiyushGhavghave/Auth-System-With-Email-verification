import User from "../models/users.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import getEmailTemplate from "../utils/emailTemplate.js";
import sendEmail from "../config/sendEmail.js";
import jwt from "jsonwebtoken";

const signup = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Validate fields
    if (!username || !email || !password) {
        throw new apiError(400, "All fields are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
    });
    if (existingUser) {
        throw new apiError(400, "User already exists");
    }

    // Create new user and verification code
    const user = new User({ username, email, password });
    const verificationCode = user.generateVerificationCode();
    await user.save();

    // Send verification email
    const emailHTML = getEmailTemplate(user.username, verificationCode);
    await sendEmail({
        to: user.email,
        subject: "Verify your email - Code valid for 1 hour",
        html: emailHTML
    });

    const tempToken = jwt.sign(
        { userId: user._id, purpose: "email_verification" },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
    );

    
    return res.status(200).json(
        new apiResponse(200, { verificationToken: tempToken }, "Verification code sent to email")
    );
})

export { signup };
const asyncHandler = require("express-async-handler"); // reduce try-catch blocks
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const sendEmail = require("../utils/sendEmail");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"});
};

// Register User
const registerUser = asyncHandler( async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(404);
    throw new Error("Email has already been registered");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password
  });

  if (user) {
    // Generate Token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true
    });

    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Log In User
const loginUser = asyncHandler( async(req, res) => {
  const { email, password } = req.body;
  
  // Validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add your email and password");
  }

  // Check if user exists in DB
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found. Please sign up");
  }

  // Check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  
  // Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true
  });

  // Log user in
  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// Log Out User
const logoutUser = asyncHandler( async(req, res) => {
  res.cookie("token", "", { // Empty string to modify existed tokens
    path: "/",
    httpOnly: true,
    expires: new Date(0), // Expires the cookie right away
    sameSite: "none",
    secure: true
  });

  return res.status(200).json({
    message: "Log out successfully"
  });
});

// Get User Data
const getUser = asyncHandler( async(req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
      const { _id, name, email, photo, phone, bio } = user;
      res.status(200).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio
      });
  } else {
    res.status(400);
    throw new Error("User not found");    
  }
});

// Get Login Status
const loginStatus = asyncHandler ( async(req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json(false);
  }

  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }

  return res.json(false);
});

// Update User's Info
const updateUser = asyncHandler ( async(req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio } = user;

    user.email = email;
    user.bio = req.body.bio || bio;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Change Password
const changePassword = asyncHandler ( async(req, res) => {
  const user = await User.findById(req.user._id);

  const {oldPassword, password} = req.body;

  // Validate
  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add both old and new password");
  }

  // Check if old password matches in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password changed successful");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});

// Forgot Password
const forgotPassword = asyncHandler ( async(req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new User("User does not exist. Please sign up");
  }

  let token = await Token.findOne({ userId: user._id});
  if (token) {
    await token.deleteOne();
  }

  // Create a Reset Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  
  // Hash token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //console.log(resetToken, hashedToken);

  // Save token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // 30' * (60'' * 1000ms)
  }).save();

  // Make a reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Reset Email
  const message = `
    
  `
  const subject = "Reset Your Password - Pilot Inventory";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = process.env.EMAIL_USER;
  const name = user.name;
  const link = resetUrl;
  const templateId = "d-cbe79b0799eb46a9b1204bf966d7e309";

  try {
    await sendEmail(
      send_to,
      reply_to,
      sent_from,
      templateId,
      {
        name: name,
        link: link,
        subject: subject
      }
    );
    
    res.status(200).json({
      success: true,
      message: "Reset Email Sent"
    });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }

  //res.send("Forgot Password");
});

// Reset Password
const resetPassword = asyncHandler ( async(req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash token to compare to tokens in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: {$gt: Date.now()}
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  // Find User
  const user = await User.findOne({_id: userToken.userId});
  user.password = password;
  await user.save();

  res.status(200).json({
    message: "Password Reset Successful. Please Login",
  })
});

module.exports = { 
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword
};
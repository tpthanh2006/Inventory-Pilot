const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyUser,
  changeRole
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

router.get("/loggedin", loginStatus);
router.get("/getuser", protect, getUser);
router.patch("/updateuser", protect, updateUser);
//router.post("/changerole", protect, changeRole);

router.patch("/changepassword", protect, changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

router.post("/sendverificationemail", protect, sendVerificationEmail);
router.patch("/verifyuser/:verificationToken", protect, verifyUser);

module.exports = router;
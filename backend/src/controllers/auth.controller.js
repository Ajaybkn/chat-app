import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!password || !fullName || !email) {
      return res.status(400).send({
        message: "all fields are required",
      });
    }
    if (password && password.length < 6) {
      return res.status(400).send({
        message: "Password must be atleast 6 characters",
      });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).send({ message: "Email already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).send({
        message: "new user successfully created",
        newUser,
      });
    } else {
      res.status(400).send({
        message: "invalid user data",
      });
    }
  } catch (error) {
    console.log("error in signup", error);
    res.status(500).send({
      message: "server Error",
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send({
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: "user is not registered",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(404).send({
        message: "Invalid Credentials",
      });
    }
    generateToken(user._id, res);
    user.password = "";
    res.status(200).send({
      message: "login successfull",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).send({
      message: "error in login",
      error,
    });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).send({
      message: "logged out successfully",
    });
  } catch (error) {
    return res.status(404).send({
      message: "error in logout",
      error,
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).send({
        message: "no pic uploaded",
      });
    }
    const uploadRes = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadRes.secure_url,
      },
      { new: true }
    );
    res.status(200).send({
      message: "profile uploaded succesfully",
      updatedUser,
    });
  } catch (error) {
    return res.status(404).send({
      message: "error in upload",
      error,
    });
  }
};
export const checkAuth = (req, res) => {
  try {
    res.status(200).send({
      message: req.user,
    });
  } catch (error) {
    console.log("error in check auth", error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

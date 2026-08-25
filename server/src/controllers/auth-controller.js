import User from "../models/User.js";
import argon2 from "argon2";
import { generateToken } from "../utils/generate-token.js";

export const register = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    // Kiểm tra dữ liệu
    if (!full_name || !email || !password || !phone) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    // Kiểm tra email
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const phoneExist = await User.findOne({ phone });
    if (phoneExist) {
      return res.status(400).json({
        message: "Phone already exists",
      });
    }

    // Mã hóa mật khẩu
    const hashPassword = await argon2.hash(password);

    // Tạo user
    const newUser = new User({
      full_name,
      email,
      password: hashPassword,
      phone,
    });
    await newUser.save();
    generateToken(res, newUser._id);

    res.status(201).json({
      message: "Create user successfully",
      data: {
        _id: newUser._id,
        full_name: newUser.full_name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    if (!userExist.status) {
      return res.status(403).json({
        message: "Your account has been deactivated",
      });
    }

    if (userExist) {
      const isPasswordValid = await argon2.verify(userExist.password, password);
      if (isPasswordValid) {
        generateToken(res, userExist._id);
        res.status(200).json({
          message: "Login successfully",
          data: {
            _id: userExist._id,
            full_name: userExist.full_name,
            email: userExist.email,
            phone: userExist.phone,
            role: userExist.role,
          },
        });
      } else {
        res.status(400).json({
          message: "Password is not correct",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successfully" });
};

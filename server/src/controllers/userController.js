import User from "../models/User.js";
import argon2 from "argon2";
import createToken from "../utils/createToken.js";
const createUser = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    // Kiểm tra dữ liệu
    if (!full_name || !email || !password || !phone) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Kiểm tra email
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Kiểm tra số điện thoại
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
    createToken(res, newUser._id);
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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      const isPasswordValid = await argon2.verify(userExist.password, password);
      if (isPasswordValid) {
        createToken(res, userExist._id);
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
          message: "Password not correct",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const logoutCurrentUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successfully" });
};

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

const getCurrentUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const updateCurrentProfile = async (req, res) => {
  console.log(req.body);
  console.log(req.user);
  const user = await User.findById(req.user._id);

  if (user) {
    user.full_name = req.body.full_name || user.full_name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const hashedPassword = await argon2.hash(req.body.password);
      user.password = hashedPassword;
    }
    user.phone = req.body.phone || user.phone;

    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      full_name: updateUser.full_name,
      email: updateUser.email,
      phone: updateUser.phone,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const deleteUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.role === "admin") {
      res.status(400).json({ message: "Cannot delete admin user" });
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const updateUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.full_name = req.body.full_name || user.full_name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;

    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      full_name: updateUser.full_name,
      email: updateUser.email,
      phone: updateUser.phone,
      role: updateUser.role,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};

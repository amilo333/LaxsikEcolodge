import User from "../models/User.js";
import argon2 from "argon2";
import crypto from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import { sendPasswordResetEmail } from "../service/auth-email.js";
import { generateToken } from "../utils/generate-token.js";

const googleClient = new OAuth2Client();
const PASSWORD_RESET_EXPIRY_MS = 15 * 60 * 1000;
const FORGOT_PASSWORD_RESPONSE =
  "If an account exists for that email, a password reset link has been sent.";

const createAuthError = (statusCode, authCode, message) =>
  Object.assign(new Error(message), { statusCode, authCode });

const sendGoogleAuthError = (res, error, context) => {
  if (error.statusCode && error.authCode) {
    return res.status(error.statusCode).json({
      code: error.authCode,
      message: error.message,
    });
  }

  console.error(`${context}:`, error);

  if (error?.code === 11000) {
    return res.status(409).json({
      code: "ACCOUNT_CONFLICT",
      message:
        "This Google account conflicts with an existing account. Please try again.",
    });
  }

  return res.status(500).json({
    code: "GOOGLE_AUTH_ERROR",
    message: "Unable to complete Google sign-in. Please try again.",
  });
};

const verifyGoogleCredential = async (credential) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw createAuthError(
      503,
      "GOOGLE_NOT_CONFIGURED",
      "Google sign-in is not configured",
    );
  }

  if (!credential) {
    throw createAuthError(
      400,
      "GOOGLE_CREDENTIAL_REQUIRED",
      "Google credential is required",
    );
  }

  let payload;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    payload = ticket.getPayload();
  } catch {
    throw createAuthError(
      401,
      "INVALID_GOOGLE_TOKEN",
      "Google sign-in session is invalid or has expired",
    );
  }

  if (
    !payload?.sub ||
    !payload.email ||
    payload.email_verified !== true ||
    !payload.name
  ) {
    throw createAuthError(
      401,
      "UNVERIFIED_GOOGLE_ACCOUNT",
      "Google account information could not be verified",
    );
  }

  return {
    ...payload,
    email: payload.email.trim().toLowerCase(),
  };
};

const publicUser = (user) => ({
  _id: user._id,
  full_name: user.full_name,
  email: user.email,
  phone: user.phone || "",
  role: user.role,
});

export const register = async (req, res) => {
  try {
    const { full_name, password, phone } = req.body;
    const email = req.body.email?.trim().toLowerCase();

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
      data: publicUser(newUser),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email?.trim().toLowerCase();

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

    if (!userExist.password) {
      return res.status(400).json({
        message: "This account uses Google sign-in",
      });
    }

    if (userExist) {
      const isPasswordValid = await argon2.verify(userExist.password, password);
      if (isPasswordValid) {
        generateToken(res, userExist._id);
        res.status(200).json({
          message: "Login successfully",
          data: publicUser(userExist),
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

export const googleLogin = async (req, res) => {
  try {
    const payload = await verifyGoogleCredential(req.body.credential);
    const email = payload.email;
    let user = await User.findOne({ google_id: payload.sub });

    if (!user) {
      user = await User.findOne({ email });

      if (user) {
        if (!user.status) {
          throw createAuthError(
            403,
            "ACCOUNT_DISABLED",
            "Your account has been deactivated",
          );
        }

        const isGoogleAuthoritative =
          email.endsWith("@gmail.com") || Boolean(payload.hd);

        if (!isGoogleAuthoritative) {
          throw createAuthError(
            409,
            "ACCOUNT_LINK_REQUIRED",
            "Confirm your existing account password to link Google sign-in.",
          );
        }

        if (user.google_id && user.google_id !== payload.sub) {
          throw createAuthError(
            409,
            "GOOGLE_ACCOUNT_CONFLICT",
            "This email is linked to another Google account",
          );
        }

        user.google_id = payload.sub;
        await user.save();
      } else {
        user = await User.create({
          full_name: payload.name.trim(),
          email,
          google_id: payload.sub,
        });
      }
    }

    if (!user.status) {
      throw createAuthError(
        403,
        "ACCOUNT_DISABLED",
        "Your account has been deactivated",
      );
    }

    generateToken(res, user._id);

    return res.status(200).json({
      message: "Login successfully",
      data: publicUser(user),
    });
  } catch (error) {
    return sendGoogleAuthError(res, error, "Google login error");
  }
};

export const linkGoogleAccount = async (req, res) => {
  try {
    const { credential, password } = req.body;

    if (!password) {
      throw createAuthError(
        400,
        "PASSWORD_REQUIRED",
        "Your current password is required",
      );
    }

    const payload = await verifyGoogleCredential(credential);
    const user = await User.findOne({ email: payload.email });

    if (!user) {
      throw createAuthError(
        404,
        "ACCOUNT_NOT_FOUND",
        "No existing account was found for this Google email",
      );
    }

    if (!user.status) {
      throw createAuthError(
        403,
        "ACCOUNT_DISABLED",
        "Your account has been deactivated",
      );
    }

    if (user.google_id === payload.sub) {
      generateToken(res, user._id);
      return res.status(200).json({
        message: "Google account is already linked",
        data: publicUser(user),
      });
    }

    if (user.google_id && user.google_id !== payload.sub) {
      throw createAuthError(
        409,
        "GOOGLE_ACCOUNT_CONFLICT",
        "This email is linked to another Google account",
      );
    }

    if (!user.password) {
      throw createAuthError(
        409,
        "PASSWORD_LOGIN_UNAVAILABLE",
        "This account does not have a password to confirm",
      );
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw createAuthError(
        401,
        "INVALID_PASSWORD",
        "The password you entered is incorrect",
      );
    }

    const googleAccountOwner = await User.findOne({
      google_id: payload.sub,
      _id: { $ne: user._id },
    });

    if (googleAccountOwner) {
      throw createAuthError(
        409,
        "GOOGLE_ACCOUNT_CONFLICT",
        "This Google account is already linked to another user",
      );
    }

    user.google_id = payload.sub;
    await user.save();
    generateToken(res, user._id);

    return res.status(200).json({
      message: "Google account linked successfully",
      data: publicUser(user),
    });
  } catch (error) {
    return sendGoogleAuthError(res, error, "Google account link error");
  }
};

export const forgotPassword = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.status) {
      return res.status(200).json({ message: FORGOT_PASSWORD_RESPONSE });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.password_reset_token = passwordResetToken;
    user.password_reset_expires = new Date(
      Date.now() + PASSWORD_RESET_EXPIRY_MS,
    );
    await user.save();

    const clientUrl = (
      process.env.CLIENT_URL || "http://localhost:3000"
    ).replace(/\/$/, "");
    const resetUrl = `${clientUrl}/auth/reset-password?token=${resetToken}`;

    try {
      await sendPasswordResetEmail({
        email: user.email,
        fullName: user.full_name,
        resetUrl,
      });
    } catch (emailError) {
      user.password_reset_token = null;
      user.password_reset_expires = null;
      await user.save();
      console.error("Password reset email error:", emailError);
    }

    return res.status(200).json({ message: FORGOT_PASSWORD_RESPONSE });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Unable to process the password reset request",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      message: "Reset token and new password are required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long",
    });
  }

  try {
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const hashPassword = await argon2.hash(password);

    const user = await User.findOneAndUpdate(
      {
        password_reset_token: passwordResetToken,
        password_reset_expires: { $gt: new Date() },
        status: true,
      },
      {
        $set: { password: hashPassword },
        $unset: {
          password_reset_token: 1,
          password_reset_expires: 1,
        },
      },
      { new: true },
    );

    if (!user) {
      return res.status(400).json({
        message: "This password reset link is invalid or has expired",
      });
    }

    return res.status(200).json({
      message: "Password reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Unable to reset password" });
  }
};

export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successfully" });
};

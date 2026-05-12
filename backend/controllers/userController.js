const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const safeRole = "customer";

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: safeRole,
    });
    res
      .status(201)
      .json({ message: "User Registered Successfully!", id: userId });
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists" });
    }
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    const normalizedRole = String(user.role || "customer")
      .trim()
      .toLowerCase();
    res.json({ token, role: normalizedRole, name: user.name, id: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const success = await UserModel.updatePasswordByEmail(
      email,
      hashedPassword,
    );

    if (!success) {
      return res.status(400).json({ message: "Failed to reset password" });
    }

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Password reset failed", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, profileImage } = req.body;

  try {
    // Verify user exists
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data
    const success = await UserModel.update(id, {
      name,
      email,
      phone,
      profileImage,
    });

    if (!success) {
      return res.status(400).json({ message: "Failed to update user" });
    }

    // Fetch updated user data
    const updatedUser = await UserModel.findById(id);

    res.json({
      message: "User updated successfully!",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    return res.json({ users });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to load users", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const success = await UserModel.deleteById(id);
    if (!success) {
      return res.status(400).json({ message: "Failed to delete user" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const normalizedRole = String(role || "")
      .trim()
      .toLowerCase();
    if (!normalizedRole) {
      return res.status(400).json({ message: "Role is required" });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const success = await UserModel.updateRole(id, normalizedRole);
    if (!success) {
      return res.status(400).json({ message: "Failed to update role" });
    }

    return res.json({ message: "Role updated successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to update role", error: err.message });
  }
};

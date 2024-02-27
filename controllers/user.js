const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registreUser = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, isAdmin } = req.body;
    if (!fullName || !phoneNumber || !password || !email) {
      return res.status(401).json({ message: "provide all fields" });
    }
    const existUser = await prisma.user.findUnique({ where: { email } });
    if (existUser) {
      return res.status(400).json({ message: "User already existe" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const NewUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        isAdmin,
      },
    });
    const accessToken = jwt.sign(
      { userId: NewUser.id, isAdmin: NewUser.isAdmin },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ NewUser, accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "all fields are mondatory" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalide password" });
    }
    const accessToken = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ accessToken, user });
  } catch (error) {
    return res.status(500).json({ message: "Login Error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        isAdmin: true,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving user details." });
  }
};

exports.getUserDetails = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        isAdmin: true,
        // Exclude sensitive information like password
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retrieving user details." });
  }
};
exports.deleteUser = async (req, res) => {
  const { id } = req.params; // ID of the user to be deleted
  const userId = req.user.userId; // Authenticated user's ID from JWT payload
  const isAdmin = req.user.isAdmin; // Admin status from JWT payload
  if (userId !== parseInt(id) && !isAdmin) {
    return res.status(403).json({
      message:
        "Access denied. Can only delete your own account or require admin privileges.",
    });
  }
  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return res.json({ message: "User deleted successfully." });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found." });
    }
    console.error("Failed to delete user:", error);
    return res.status(500).json({ message: "Failed to delete user." });
  }
};

exports.UpdateUser = async (req, res) => {
  const userId = req.user.userId;
  const { fullName, email, phoneNumber } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        email,
        phoneNumber,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        isAdmin: true,
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    if (error.code === "P2025") {
      // Prisma's error code for record not found
      return res.status(404).send({ message: "User not found." });
    }
    console.error("Failed to update user: ", error);
    res.status(500).send({ message: "Failed to update user." });
  }
};
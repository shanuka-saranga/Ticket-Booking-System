const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  resetPassword,
  updateUser,
  getAllUsers,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);
router.get("/admin/users", authenticateToken, requireAdmin, getAllUsers);
router.delete("/admin/users/:id", authenticateToken, requireAdmin, deleteUser);
router.put(
  "/admin/users/:id/role",
  authenticateToken,
  requireAdmin,
  updateUserRole,
);
router.put("/:id", updateUser);

module.exports = router;

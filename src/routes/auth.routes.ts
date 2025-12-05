import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;

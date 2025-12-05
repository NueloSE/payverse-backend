import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { getPayments, createPayment } from "../controllers/payment.controller";

const router = Router();

router.use(protect);

router.get("/", getPayments);
router.post("/", createPayment);

export default router;

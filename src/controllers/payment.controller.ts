import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPayments = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const [sent, received] = await Promise.all([
      prisma.payment.findMany({
        where: { senderId: userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.findMany({
        where: { receiverEmail: req.user!.email },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    res.json({
      sent,
      received,
      summary: {
        totalSent: sent.reduce((sum, p) => sum + p.amount, 0),
        totalReceived: received.reduce((sum, p) => sum + p.amount, 0),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};
export const createPayment = async (req: Request, res: Response) => {
  const senderId = req.user!.id;
  const senderEmail = req.user!.email;
  const { amount, currency, receiverEmail } = req.body;

  if (!amount || amount <= 0)
    return res.status(400).json({ error: "Invalid amount" });
  if (!["NGN", "GHS", "KES"].includes(currency)) {
    return res.status(400).json({ error: "Currency must be NGN, GHS or KES" });
  }
  if (!receiverEmail || !receiverEmail.includes("@")) {
    return res.status(400).json({ error: "Valid receiver email required" });
  }
  if (receiverEmail === senderEmail) {
    return res.status(400).json({ error: "Cannot send money to yourself" });
  }

  try {
    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail },
      select: { id: true },
    });

    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const payment = await prisma.payment.create({
      data: {
        amount,
        currency,
        senderId,
        receiverEmail,
        status: "PENDING",
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    setTimeout(async () => {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "COMPLETED" },
      });
    }, 2000);

    return res.status(201).json({ payment });
  } catch (error: any) {
    return res.status(500).json({
      error: "Payment failed",
      details: error.message,
    });
  }
};

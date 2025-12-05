export interface CreatePaymentRequest {
  amount: number;
  currency: "NGN" | "GHS" | "KES";
  receiverId: string;
}

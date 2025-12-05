import { User } from "@prisma/client";

declare module "cookie-parser";
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

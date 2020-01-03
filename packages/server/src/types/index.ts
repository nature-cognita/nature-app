import { Prisma } from "generated/prisma-client/index";
import { Request } from "express";

export type User = {
  id: string;
};

export interface PrismaContext {
  prisma: Prisma;
  req: Request & { user: User };
}

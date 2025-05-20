/*This is made for the password encreapting and checking it while login, and also for gneration refresh
access token and also it stores the refresh token in the database too*/

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma";
import { ApiError } from "../utils/ApiError";

const prisma = new PrismaClient();

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 20);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateAccessAndRefreshTokens = async (userId: string) => {
  const student = await prisma.student.findFirst({
    where: { id: userId },
  });

  if (!student) {
    throw new ApiError(404, "User not found while generating tokens");
  }

  const accessSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!accessSecret || !refreshSecret) {
    throw new ApiError(500, "Token secrets are not defined");
  }

  const accessToken = jwt.sign({ id: student.id }, accessSecret, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: student.id }, refreshSecret, {
    expiresIn: "7d",
  });

  // Store refresh token in DB
  await prisma.student.update({
    where: { id: student.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
};

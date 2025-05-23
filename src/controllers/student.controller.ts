import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken"
import {hashPassword,generateAccessAndRefreshTokens,comparePassword,} from "../services/auth.service";

const prisma = new PrismaClient()

const options = {
    httpOnly:true,
    secure:true,
}

//Register Student
const registerStudent = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, collegeName, username, password } = req.body;

  if ([name, email, username, password, collegeName].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existingEmail = await prisma.student.findFirst(
    { where: { email } }
    );
  if (existingEmail) {
    throw new ApiError(400, "Email already exists");
  }

  const existingUsername = await prisma.student.findFirst({ where: { username } });
  if (existingUsername) {
    throw new ApiError(400, "Username already exists");
  }

  const hashedPassword = await hashPassword(password);

  const student = await prisma.student.create({
    data: {
      name,
      email,
      username: username.toLowerCase(),
      college_name: collegeName,
      password: hashedPassword,
    },
  });

  const createdStudent = await prisma.student.findUnique({
    where: { id: student.id },
    select: {
      id: true,
      name: true,
      college_name: true,
      email: true,
      type: true,
      clubId: true,
    },
  });

  res.status(200).json(new ApiResponse(200, createdStudent, "Student registered successfully"));
});

//Login Student
const loginStudent = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  if (!(username || email).every((field:string) => field?.trim())) {
    throw new ApiError(400, "Username or email is required");
  }

  const student = await prisma.student.findFirst({ where: { username: username.toLowerCase(), email : email } });

  if (!student) {
    throw new ApiError(400, "Invalid username or password");
  }

  const isPasswordCorrect = await comparePassword(password, student.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid username or password");
  }
  const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(student.id);

  const updatedStudent = await prisma.student.findFirst({
    where: { id: student.id },
    select: {
      id: true,
      name: true,
      college_name: true,
      email: true,
      type: true,
      clubId: true,
    },
  });

  res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(new ApiResponse(200, {
    student : updatedStudent,accessToken,refreshToken
  }, "Login successful"));
});

// Logout Student
const logoutStudent = asyncHandler(async (req: Request, res: Response)=> {
    if (!(req as any).student?.id) {
      throw new ApiError(400, "Unauthorized");
    }
  
    await prisma.student.update({
      where: { id: (req as any).student.id },
      data: { refreshToken: undefined },
    });
  
    res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Student Logged Out"));
  });
  

//Refresh Accesss Token
  const refreshAccessToken = asyncHandler(async (req: Request, res: Response)=> {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized access: No refresh token provided");
    }
  
    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as { id: string };
  
      const student = await prisma.student.findUnique({
        where: { id: decodedToken.id },
      });
  
      if (!student) {
        throw new ApiError(401, "Invalid refresh token: Student not found");
      }
  
      if (incomingRefreshToken !== student.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or already used");
      }
  
      const { accessToken: updatedAccessToken, refreshToken: updatedRefreshToken } =
        await generateAccessAndRefreshTokens(student.id);
  
    res
    .status(200)
    .cookie("accessToken", updatedAccessToken, options)
    .cookie("refreshToken", updatedRefreshToken, options)
    .json(
        new ApiResponse(
            200,
            { accessToken: updatedAccessToken, refreshToken: updatedRefreshToken },
            "Access token is refreshed"
          )
        );
    } catch (error: any) {
      throw new ApiError(401, error?.message || "Invalid refresh token");
    }
  });
  

export { registerStudent, loginStudent, logoutStudent, refreshAccessToken };

import { PrismaClient } from "../../generated/prisma";
import {  Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const prisma = new PrismaClient();

export const verifyJWT = asyncHandler(async (req:Request, res:Response, next:NextFunction) => {
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       throw new ApiError(400, "Unauthorized request");
//     }

//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // let user = await prisma.owner.findFirst({
    //   where: {
    //     id: decodedToken.id,
    //   },
    // });

    // if (!user) {
    //   user = await prisma.tenant.findFirst({
    //     where: {
    //       id: decodedToken.id,
    //     },
    //   });
    // }

    // if(!user){
    //   throw new ApiError(400, "Invalid access token")
    // }

    // req.user = user;
    // next();
//   } 
//   catch (error) {
//     throw new ApiError(401, error?.message || "Invalid access token");
//   }
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      throw new ApiError(401, "Unauthorized request: No token provided");
    }
  
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new ApiError(500, "Access Token secret not defined");
    }
  
    const decodedToken = jwt.verify(token, secret);
  
    if (typeof decodedToken === "string" || !("id" in decodedToken)) {
      throw new ApiError(401, "Invalid token payload");
    }
  
    const studentId = (decodedToken as { id: string }).id;
  
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });
  
    if (!student) {
      throw new ApiError(401, "Invalid access token: Student not found");
    }
  
    (req as any).student = student;
    next();
  });

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const prisma_1 = require("../../generated/prisma");
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma = new prisma_1.PrismaClient();
exports.verifyJWT = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}));

import {  Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

const prisma = new PrismaClient();

const addMember = asyncHandler(async(req :Request ,res :Response )=>{

    try {
        const {studentId,clubId} = req.body
        const student = await prisma.student.update({
            where: { id: studentId },
            data: {
              clubId : clubId,
              type: "member",
            },
          });
    
        res.status(200)
        .json(new ApiResponse(
            200,
            student,
            "Member is added to the club"
        ))
    } catch (error) {
        throw new ApiError(400,"Something went wrong while adding member")
    }
})

const removeMember = asyncHandler(async(req :Request ,res :Response )=>{

    try {
        const {studentId} = req.body
        const student = await prisma.student.update({
            where: { id: studentId },
            data: {
              clubId : undefined,
              type: "member",
            },
          });
    
        res.status(200)
        .json(new ApiResponse(
            200,
            student,
            "Member was removed from the club"
        ))
    } catch (error) {
        throw new ApiError(400,"Something went wrong while removing member")
    }
})

const addAdmin = asyncHandler(async(req :Request ,res :Response )=>{
    try {
        const {studentId} = req.body
        const student = await prisma.student.update({
            where: { id: studentId },
            data: {
              type: "admin",
            },
          });
    
        res.status(200)
        .json(new ApiResponse(
            200,
            student,
            `${student.name} is now an admin`
        ))
    } catch (error) {
        throw new ApiError(400,"Something went wrong while making admin")
    }
})

const removeAdmin = asyncHandler(async(req :Request ,res :Response )=>{
    try {
        const {studentId} = req.body
        const student = await prisma.student.update({
            where: { id: studentId },
            data: {
              type: "member",
            },
          });
    
        res.status(200)
        .json(new ApiResponse(
            200,
            student,
            `${student.name} is now a member`
        ))
    } catch (error) {
        throw new ApiError(400,"Something went wrong while removing admin")
    }
})
export {addMember,removeMember,addAdmin,removeAdmin}
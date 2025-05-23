import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { PrismaClient } from "../../generated/prisma";
import { uploadOnCloudinary } from "../utils/cloudinary";

const prisma = new PrismaClient();

const registerClub = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    type,
    collegeName,
    description,
    instaLink,
    githubLink,
    linkedLink,
  } = req.body;

  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  let logoUrl: string | undefined;

  if (files?.logo?.length) {
    const logoLocalPath = files.logo[0].path;

    const media = await uploadOnCloudinary(logoLocalPath);
    if (!media?.url) {
      throw new ApiError(400, "Error uploading on cloudinary");
    }

    logoUrl = media.url;
  }

  const clubData: any = {
    name,
    type,
    collegeName,
    description,
    instaLink,
    githubLink,
    linkedinLink: linkedLink,
  };

  if (logoUrl) {
    clubData.logo = logoUrl;
  }

  const club = await prisma.club.create({
    data: clubData,
  });

  // //making the admin who created the club
  // await prisma.student.update({
  //   where: { id: (req as any).user.id },
  //   data: {
  //     clubId: club.id,
  //     type: "admin",
  //   },
  // });

  if (!club) {
    throw new ApiError(400, "Error registering the club");
  }

  res.status(201).json(new ApiResponse(201, club, "New club created!"));
});

const deleteClub = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.body;

  await prisma.club.delete({
    where: {
      id: id,
    },
  });

  res.status(200).json(new ApiResponse(200, "club deleted successfully "));
});

const searchClub = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  const clubs = await prisma.club.findMany({
    where: {
      name: { contains: name, mode: "insensitive" },
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, clubs, "clubs fetched successfully"));
});

const updateClub = asyncHandler(async (req: Request, res: Response) => {
  const clubId = req.params.id;

  const existingClub = await prisma.club.findUnique({
    where: { id: clubId },
  });

  if (!existingClub) {
    throw new ApiError(404, "Club not found");
  }

  const updateData: any = {};

  const body = req.body || {};
  const { name, type, description, instaLink, githubLink, linkedinLink } = body;
  if (name) updateData.name = name;
  if (type) updateData.type = type;
  if (description) updateData.description = description;
  if (instaLink) updateData.instaLink = instaLink;
  if (githubLink) updateData.githubLink = githubLink;
  if (linkedinLink) updateData.linkedinLink = linkedinLink;

  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;
  const logoLocalPath = files?.logo[0]?.path;

  console.log(logoLocalPath)

  let logoUrl: string | undefined;

  if (files?.logo?.length) {
    const logoLocalPath = files.logo[0].path;

    const media = await uploadOnCloudinary(logoLocalPath);
    console.log(media)
    if (!media?.url) {
      throw new ApiError(400, "Error uploading on cloudinary");
    }

    logoUrl = media.url;
    updateData.logo = logoUrl
  }

  const updatedClub = await prisma.club.update({
    where: { id: clubId },
    data: updateData,
  });

  res
    .status(200)
    .json(new ApiResponse(200, updatedClub, "Club updated successfully"));
});



export { registerClub, deleteClub, searchClub, updateClub };

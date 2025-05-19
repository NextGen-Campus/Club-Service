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

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

  console.log(req.body)
  console.log(req.files)


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

  if (!club) {
    throw new ApiError(400, "Error registering the club");
  }

  res.status(201).json(new ApiResponse(201, club, "New club created!"));
});

export { registerClub };

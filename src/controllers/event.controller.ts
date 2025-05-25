/*This is a basic representaion of event this will be updated after we get more info 
of the event and its contents*/

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

const postEvent = asyncHandler(async (req: Request, res: Response) => {
    const {event} = req.body

    if(!event){
        throw new ApiError(400,"No Event Available")
    }

    const eventData:any = {
        event 
    }

    const Event = await prisma.event.create({
        data : eventData,
    })

    if(!Event){
        throw new ApiError(400,"Something went wriong while adding event")
    }

    res
    .status(200)
    .json(new ApiResponse(201, Event, "New Event created successsfully"))
})

const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    const {id} = req.body

    await prisma.event.delete({
        where: {
          id: id,
        },
      });
    
      res
      .status(200)
      .json(new ApiResponse(200, "event deleted successfully "));
})

const updateEvent = asyncHandler(async (req: Request, res: Response) => {
    const eventId = req.params.id;
    
      const existingEvent = await prisma.event.findUnique({
        where: { id: eventId },
      });
    
      if (!existingEvent) {
        throw new ApiError(404, "Event not found");
      }
      const updateData: any = {};

        const body = req.body || {};
        const { event } = body;
        if (event) updateData.event = event;
    
    const updatedEvent = await prisma.club.update({
        where: { id: eventId },
        data: updateData,
    });

    res
    .status(200)
    .json(new ApiResponse(200, updatedEvent, "Event updated successfully"));
})

export {updateEvent,postEvent,deleteEvent}
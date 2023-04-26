import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";



export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction){

    const { userId } = req

    try{ 

        const booking = await bookingService.getBookingById(userId)
        
        return res.status(httpStatus.OK).send(booking)

    } catch(err){
        next(err)
    }
}

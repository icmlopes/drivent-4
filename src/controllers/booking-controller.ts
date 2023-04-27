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

export async function postBooking(req: AuthenticatedRequest, res: Response, next: NextFunction){

    const { userId } = req

    const { roomId } = req.body
    
    console.log("Estou no controller e quero ver o que recebo no body do request", req.body, "Ver se tem o roomId", req.body.roomId)

    try{

        const booking = await bookingService.NewBooking(userId, roomId)

        return res.status(httpStatus.CREATED).send(booking)

    } catch(err){
        console.log("Estou no controller e quero ver o erro que veio", err)
        next(err)
    }

}

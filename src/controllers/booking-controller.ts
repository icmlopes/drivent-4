import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";



export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction){

    const { userId } = req

    try{ 

        const booking = await bookingService.getBookingByUserId(userId)
        
        return res.status(httpStatus.OK).send(booking)

    } catch(err){
        next(err)
    }
}

export async function postBooking(req: AuthenticatedRequest, res: Response, next: NextFunction){

    const { userId } = req

    const { roomId } = req.body

    try{

        const booking = await bookingService.newBook(userId, roomId)

        return res.status(httpStatus.OK).send( {bookingId: booking.id} )

    } catch(err){

        next(err)
    }

}

export async function changeBooking(req: AuthenticatedRequest, res: Response, next: NextFunction){

    const { userId } = req

    const { roomId } = req.body

    const { bookingId } = req.params

    try{

        const newBooking = await bookingService.updateBookingRoom(userId, Number(bookingId), roomId) 

        return res.status(httpStatus.OK).send( {bookingId: newBooking.id} ) 

    } catch(err){
        next(err)
    }
}
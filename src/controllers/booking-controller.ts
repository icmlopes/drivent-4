import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import getBooking from "@/services/booking-service";


export async function getBookingByUserId(req: AuthenticatedRequest, res: Response) {
    
    const { userId } =  req;

    try{ 

        const bookings = await getBooking(Number(userId))

        console.log("Check if information its getting here:", bookings)
        return res.status(httpStatus.OK).send(bookings);

    } catch (error){
        
        return res.sendStatus(httpStatus.PAYMENT_REQUIRED);

    }
}
































// export async function getHotels(req: AuthenticatedRequest, res: Response) {
//   const { userId } = req;

//   try {
//     const hotels = await hotelService.getHotels(Number(userId));
//     return res.status(httpStatus.OK).send(hotels);
//   } catch (error) {
//     if (error.name === "NotFoundError") {
//       return res.sendStatus(httpStatus.NOT_FOUND);
//     }
//     return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
//   }
// }
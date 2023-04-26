import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";


async function getBookingById(userId: number){

    const booking = await bookingRepository.getBookingById(userId);

    if(!booking){
        throw notFoundError()
    }

    return booking;
}



const bookingService = { getBookingById };

export default bookingService;
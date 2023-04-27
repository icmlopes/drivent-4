import { forbiddenError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";


async function getBookingById(userId: number){

    const booking = await bookingRepository.getBookingById(userId);

    if(!booking){
        throw notFoundError()
    }

    return booking;
}

async function NewBooking(userId: number, roomId: number){

    const roomIsAvailable = await bookingRepository.findRoom(roomId)

    if(roomIsAvailable.capacity === 0){
        throw forbiddenError()
    }

    if(!roomIsAvailable){
        throw notFoundError()
    }

    const booking = await bookingRepository.createBooking(userId, roomId)

    return booking
}



const bookingService = { 
    getBookingById,
    NewBooking
 };

export default bookingService;
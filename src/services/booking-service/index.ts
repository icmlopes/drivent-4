import { forbiddenError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import dayjs from "dayjs";


async function getBookingByUserId(userId: number){

    const booking = await bookingRepository.findBookingByUserId(userId);

    if(!booking){
        throw notFoundError()
    }

    return booking;
}


async function roomIsAvailable(roomId: number){

    const room = await bookingRepository.findRoom(roomId)

    if(!room){
        throw notFoundError()
    }

    if(room.capacity === 0){
        throw forbiddenError()
    }

}

async function verifyAllRules(userId: number){

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

    if (!enrollment) {
      throw notFoundError();
    }

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  
    if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
      throw forbiddenError();
    }
}

async function newBook(userId: number, roomId: number){

    await verifyAllRules(userId)
    await roomIsAvailable(roomId)

    const booking = await bookingRepository.createBooking(userId, roomId)

    return booking
}


export async function updateBookingRoom(userId: number, bookingId: number, roomId: number){

    await verifyAllRules(userId)
    const checkBooking = await getBookingByUserId(userId)
    if( checkBooking.id !== bookingId ){
    throw notFoundError()        
    }
    await roomIsAvailable(roomId)

    const data = { roomId }

    const changeBooking = bookingRepository.updateBooking(bookingId, roomId)

    return changeBooking
}

const bookingService = { 
    getBookingByUserId,
    newBook,
    updateBookingRoom
 };

export default bookingService;
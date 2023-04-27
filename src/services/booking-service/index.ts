import { forbiddenError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";


async function getBookingByUserId(userId: number){

    const booking = await bookingRepository.findBookingByUserId(userId);

    if(!booking){
        throw notFoundError()
    }

    return booking;
}


async function roomIsAvailable(roomId: number){

    const room = await bookingRepository.findRoom(roomId)

    if(room.capacity === 0){
        throw forbiddenError()
    }

    if(!room){
        throw notFoundError()
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

async function NewBook(userId: number, roomId: number){

    await verifyAllRules(userId)
    await roomIsAvailable(roomId)

    const booking = await bookingRepository.createBooking(userId, roomId)

    return booking
}

const bookingService = { 
    getBookingByUserId,
    NewBook
 };

export default bookingService;
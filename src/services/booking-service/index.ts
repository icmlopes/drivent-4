import { notFoundError } from "@/errors";
import { findBookingByUserId } from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";

async function verifyTicket(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError(); //mudar o erro, tenho que criar um para esse caso aqui
  }
}

async function getBooking(userId: number) {
    await verifyTicket(userId);

    const booking = await findBookingByUserId(userId);
  
    if (!booking) {
      throw notFoundError();
    }
    return booking;
}

export default getBooking;
import { prisma } from "@/config";
import { Booking } from "@prisma/client";
import dayjs from "dayjs";

async function findBookingByUserId(userId: number){
    return prisma.booking.findFirst({
        where: {userId},
        select: {
            id: true,
            Room: true,
        }
    })
}

async function createBooking(userId: number, roomId: number){
    return prisma.booking.create({
        data: {
            userId,
            roomId
        }
    })
}

async function findRoom(roomId: number){
    return prisma.room.findFirst({
        where: { id: roomId }
    })
}


async function updateBooking( bookingId: number, roomId: number){
    return prisma.booking.update({
        where: { id: bookingId },
        data:{
            roomId: roomId,
            updatedAt: dayjs().toDate()
        }
    })
}

// type UpdateBooking = Omit<Booking, "createdAt">;


export default {
    findBookingByUserId,
    createBooking,
    findRoom,
    updateBooking
}

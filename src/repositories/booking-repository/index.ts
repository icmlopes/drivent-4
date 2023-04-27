import { prisma } from "@/config";

async function getBookingById(userId: number){
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

export default {
    getBookingById,
    createBooking,
    findRoom
}

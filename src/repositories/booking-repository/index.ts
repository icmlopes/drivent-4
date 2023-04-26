import { prisma } from "@/config";


async function getBookingById(userId: number){
    return prisma.booking.findFirst({
        where: {userId}
    })
}


export default {
    getBookingById,
}

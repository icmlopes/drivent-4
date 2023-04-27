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


export default {
    getBookingById,
}

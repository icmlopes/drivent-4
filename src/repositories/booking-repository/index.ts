import { prisma } from "@/config";


export async function findBookingByUserId(userId: number){
    return prisma.booking.findFirst({
        where: { userId }
    })
}


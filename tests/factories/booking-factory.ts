import { prisma } from "@/config";
import faker from "@faker-js/faker";
import dayjs from "dayjs";



export async function createBooking(userId: number, roomId: number){
    return prisma.booking.create({
        data: {
            userId,
            roomId,
            updatedAt: dayjs().toDate() 
        }
    })
}

export async function createFullRoom(hotelId: number){
    return prisma.room.create({
        data: {
            name: faker.name.findName(),
            capacity: 0,
            hotelId,
        }
    })
}
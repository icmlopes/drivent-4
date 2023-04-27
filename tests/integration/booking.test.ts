import app, { init } from "@/app";
import supertest from "supertest";
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '.prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import httpStatus from 'http-status';
import {
    createEnrollmentWithAddress,
    createHotel,
    createPayment,
    createRoomWithHotelId,
    createTicket,
    createTicketTypeRemote,
    createTicketTypeWithHotel,
    createUser,
    generateCreditCardData,
} from '../factories';
import { createBooking } from "../factories/booking-factory";
import { executionAsyncId } from "async_hooks";

beforeAll(async () => {
    await init()
});

beforeEach(async () => {
    await cleanDb()
})

const server = supertest(app)

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 if user has not booked a room ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it("should respond with status 200 and a list of user's bookings", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel()
            const room = await createRoomWithHotelId(hotel.id)

            const booking = await createBooking(user.id, room.id);

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);

            expect(response.body).toEqual(
                expect.objectContaining({
                    id: booking.id,
                    Room: {
                        id: room.id,
                        name: room.name,
                        capacity: room.capacity,
                        hotelId: room.hotelId,
                        createdAt: room.createdAt.toISOString(),
                        updatedAt: room.updatedAt.toISOString(),
                    }
                })

            );
        });
    });
});


describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 403 if user has not booked a room ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 when user has no enrollment ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
      
            const ticketType = await createTicketTypeRemote();
      
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
          });

        it('should respond with status 403 when user ticket is remote ', async () => {

            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            // await createPayment(ticket.id, ticketType.price);
      
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
          });

          it("should respond with status 403 if user's status isn't PAID", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            await createTicket(enrollment.id, ticketType.id, "RESERVED");
            const body = { roomId: 1 };
      
            const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
            expect(response.status).toBe(httpStatus.FORBIDDEN);
          });
      
          
          it('should respond with status 404 for invalid hotel id', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
      
            const createdHotel = await createHotel();
      
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
          });
      

        it("Should respond with status 404 if roomId doesn't exist", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel()
            // const room = await createRoomWithHotelId(hotel.id)

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND)
        })

        it("Should respond with status 403 if if room capacity is full", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel()
            // const room = await createRoomWithHotelId(hotel.id)

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.FORBIDDEN)
        })

        it("should respond with status 200 if booked", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel()
            const room = await createRoomWithHotelId(hotel.id)

            const booking = await createBooking(user.id, room.id);

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK);

            expect(response.body).toEqual(({ bookingId: expect.any(Number)}))
        });
    });
});

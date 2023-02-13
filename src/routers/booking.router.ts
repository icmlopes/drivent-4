import { getBookingByUserId } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router()

bookingRouter
    .all("/*",  authenticateToken)
    .get("/", getBookingByUserId)

export { bookingRouter };
import { NextRequest } from "next/server";
import { db } from "@/../db";
import { appointments, services } from "@/../db/schema";
import { eq, and, gte, lt } from "drizzle-orm";
import { successResponse, errorResponse } from "@/lib/api-utils";

// Business hours: 8 AM to 6 PM
const BUSINESS_START_HOUR = 8;
const BUSINESS_END_HOUR = 18;
const SLOT_INTERVAL_MINS = 30;

// GET - Get available time slots for a specific date and service
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const serviceIdParam = searchParams.get("serviceId");

    if (!dateParam || !serviceIdParam) {
      return errorResponse("Date and service ID are required", 400);
    }

    const serviceId = parseInt(serviceIdParam);
    const requestedDate = new Date(dateParam);

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requestedDate < today) {
      return errorResponse("Cannot book appointments in the past", 400);
    }

    // Get service to know duration
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId));

    if (!service) {
      return errorResponse("Service not found", 404);
    }

    const serviceDuration = service.durationMins || 60;

    // Get all appointments for this service on this date
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.serviceId, serviceId),
          gte(appointments.appointmentDate, startOfDay),
          lt(appointments.appointmentDate, endOfDay)
        )
      );

    // Generate all possible time slots for the day
    const slots = [];
    const slotDate = new Date(requestedDate);

    for (let hour = BUSINESS_START_HOUR; hour < BUSINESS_END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_INTERVAL_MINS) {
        slotDate.setHours(hour, minute, 0, 0);

        // Skip if slot end time goes beyond business hours
        const slotEndTime = new Date(slotDate);
        slotEndTime.setMinutes(slotEndTime.getMinutes() + serviceDuration);

        if (slotEndTime.getHours() >= BUSINESS_END_HOUR) {
          continue;
        }

        // Check if slot is in the past (for today)
        const now = new Date();
        if (slotDate < now) {
          continue;
        }

        // Check if slot conflicts with existing appointments
        const isBooked = bookedAppointments.some((apt) => {
          const aptStart = new Date(apt.appointmentDate);
          const aptEnd = new Date(aptStart);
          aptEnd.setMinutes(aptEnd.getMinutes() + serviceDuration);

          const slotStart = new Date(slotDate);
          const slotEnd = new Date(slotDate);
          slotEnd.setMinutes(slotEnd.getMinutes() + serviceDuration);

          // Check for overlap
          return (
            (slotStart >= aptStart && slotStart < aptEnd) ||
            (slotEnd > aptStart && slotEnd <= aptEnd) ||
            (slotStart <= aptStart && slotEnd >= aptEnd)
          );
        });

        slots.push({
          time: new Date(slotDate).toISOString(),
          available: !isBooked,
          displayTime: slotDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        });
      }
    }

    return successResponse({
      date: dateParam,
      serviceId,
      serviceName: service.name,
      slots,
    });
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return errorResponse("Failed to fetch available time slots", 500);
  }
}

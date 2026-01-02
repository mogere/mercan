import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/../db";
import { appointments, services } from "@/../db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

// POST - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return errorResponse("Unauthorized - Please login to book an appointment", 401);
    }

    const body = await request.json();
    const { serviceId, appointmentDate, notes } = body;

    // Validation
    if (!serviceId || !appointmentDate) {
      return errorResponse("Service ID and appointment date are required", 400);
    }

    // Validate the date is in the future
    const appointmentDateTime = new Date(appointmentDate);
    if (appointmentDateTime < new Date()) {
      return errorResponse("Appointment date must be in the future", 400);
    }

    // Check if service exists
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId));

    if (!service) {
      return errorResponse("Service not found", 404);
    }

    // Check if the time slot is available
    const startTime = new Date(appointmentDateTime);
    const endTime = new Date(appointmentDateTime);
    endTime.setMinutes(endTime.getMinutes() + (service.durationMins || 60));

    const conflictingAppointments = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.serviceId, serviceId),
          gte(appointments.appointmentDate, startTime),
          lte(appointments.appointmentDate, endTime)
        )
      );

    if (conflictingAppointments.length > 0) {
      return errorResponse("This time slot is already booked. Please choose another time.", 409);
    }

    // Create appointment
    const [newAppointment] = await db
      .insert(appointments)
      .values({
        userId: parseInt(session.user.id),
        serviceId,
        appointmentDate: appointmentDateTime,
        status: "pending",
        notes: notes || null,
      })
      .returning();

    return successResponse(
      {
        ...newAppointment,
        service: {
          id: service.id,
          name: service.name,
          price: service.price,
        },
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// GET - Fetch user's appointments
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const userId = parseInt(session.user.id);

    const userAppointments = await db
      .select({
        id: appointments.id,
        appointmentDate: appointments.appointmentDate,
        status: appointments.status,
        notes: appointments.notes,
        createdAt: appointments.createdAt,
        service: {
          id: services.id,
          name: services.name,
          description: services.description,
          price: services.price,
          imageUrl: services.imageUrl,
          durationMins: services.durationMins,
        },
      })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.appointmentDate));

    return successResponse(userAppointments);
  } catch (error) {
    return handleApiError(error);
  }
}

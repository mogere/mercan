import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/../db";
import { appointments, services } from "@/../db/schema";
import { eq, desc } from "drizzle-orm";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

// GET - Get all appointments (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "admin") {
      return errorResponse("Unauthorized - Admin access required", 403);
    }

    const allAppointments = await db
      .select({
        id: appointments.id,
        appointmentDate: appointments.appointmentDate,
        status: appointments.status,
        notes: appointments.notes,
        createdAt: appointments.createdAt,
        service: {
          id: services.id,
          name: services.name,
          price: services.price,
          durationMins: services.durationMins,
        },
      })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .orderBy(desc(appointments.appointmentDate));

    return successResponse(allAppointments);
  } catch (error) {
    return handleApiError(error);
  }
}

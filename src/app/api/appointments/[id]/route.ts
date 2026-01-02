import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/../db";
import { appointments, services } from "@/../db/schema";
import { eq, and } from "drizzle-orm";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

// GET - Get specific appointment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;
    const appointmentId = parseInt(id);

    const [appointment] = await db
      .select({
        id: appointments.id,
        appointmentDate: appointments.appointmentDate,
        status: appointments.status,
        notes: appointments.notes,
        createdAt: appointments.createdAt,
        userId: appointments.userId,
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
      .where(eq(appointments.id, appointmentId));

    if (!appointment) {
      return errorResponse("Appointment not found", 404);
    }

    // Check if user owns this appointment (or is admin)
    if (
      appointment.userId !== parseInt(session.user.id) &&
      session.user.role !== "admin"
    ) {
      return errorResponse("Unauthorized to view this appointment", 403);
    }

    return successResponse(appointment);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH - Update appointment (reschedule or change status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;
    const appointmentId = parseInt(id);
    const body = await request.json();
    const { appointmentDate, status, notes } = body;

    // Get existing appointment
    const [existingAppointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointmentId));

    if (!existingAppointment) {
      return errorResponse("Appointment not found", 404);
    }

    // Check ownership (or admin)
    if (
      existingAppointment.userId !== parseInt(session.user.id) &&
      session.user.role !== "admin"
    ) {
      return errorResponse("Unauthorized to update this appointment", 403);
    }

    // If rescheduling, validate the new date
    if (appointmentDate) {
      const newDate = new Date(appointmentDate);
      const now = new Date();

      // Check if new date is in the future
      if (newDate < now) {
        return errorResponse("Cannot reschedule to a past date", 400);
      }

      // Check if appointment is within 24 hours
      const hoursDiff = (new Date(existingAppointment.appointmentDate).getTime() - now.getTime()) / (1000 * 60 * 60);
      if (hoursDiff < 24 && session.user.role !== "admin") {
        return errorResponse(
          "Cannot reschedule within 24 hours of appointment. Please contact support.",
          400
        );
      }
    }

    // Update appointment
    const updateData: any = {};
    if (appointmentDate) updateData.appointmentDate = new Date(appointmentDate);
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const [updatedAppointment] = await db
      .update(appointments)
      .set(updateData)
      .where(eq(appointments.id, appointmentId))
      .returning();

    return successResponse(updatedAppointment);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE - Cancel appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;
    const appointmentId = parseInt(id);

    // Get existing appointment
    const [existingAppointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointmentId));

    if (!existingAppointment) {
      return errorResponse("Appointment not found", 404);
    }

    // Check ownership (or admin)
    if (
      existingAppointment.userId !== parseInt(session.user.id) &&
      session.user.role !== "admin"
    ) {
      return errorResponse("Unauthorized to cancel this appointment", 403);
    }

    // Check if appointment is within 24 hours
    const now = new Date();
    const appointmentDate = new Date(existingAppointment.appointmentDate);
    const hoursDiff = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 24 && session.user.role !== "admin") {
      return errorResponse(
        "Cannot cancel within 24 hours of appointment. Please contact support.",
        400
      );
    }

    // Instead of deleting, update status to cancelled
    const [cancelledAppointment] = await db
      .update(appointments)
      .set({ status: "cancelled" })
      .where(eq(appointments.id, appointmentId))
      .returning();

    return successResponse({
      message: "Appointment cancelled successfully",
      appointment: cancelledAppointment,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

import { db } from "../../../../../db";
import {
    maintenanceAppointments,
    appointmentStatusUpdates,
} from "../../../../../db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const { appointmentId, status, message } = await request.json();

        if (!appointmentId || !status) {
            return NextResponse.json(
                { error: "Appointment ID and status are required" },
                { status: 400 }
            );
        }

        // Update appointment status
        await db
            .update(maintenanceAppointments)
            .set({
                status,
                updatedAt: new Date(),
            })
            .where(eq(maintenanceAppointments.id, parseInt(appointmentId)));

        // Create status update record
        await db.insert(appointmentStatusUpdates).values({
            appointmentId: parseInt(appointmentId),
            status,
            message: message || `Status updated to ${status}`,
        });

        // Get updated appointment
        const [appointment] = await db
            .select()
            .from(maintenanceAppointments)
            .where(eq(maintenanceAppointments.id, parseInt(appointmentId)))
            .limit(1);

        return NextResponse.json(appointment);
    } catch (error) {
        console.error("Error updating appointment status:", error);
        return NextResponse.json(
            { error: "Failed to update appointment status" },
            { status: 500 }
        );
    }
}


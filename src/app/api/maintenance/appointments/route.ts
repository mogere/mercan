import { db } from "../../../../../db";
import {
    maintenanceAppointments,
    appointmentStatusUpdates,
    userCars,
    services,
} from "../../../../../db/schema";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const { userId, userCarId, serviceId, scheduledDate, notes } =
            await request.json();

        if (!userId || !userCarId || !serviceId || !scheduledDate) {
            return NextResponse.json(
                {
                    error:
                        "User ID, car ID, service ID, and scheduled date are required",
                },
                { status: 400 }
            );
        }

        // Create appointment
        const [appointment] = await db
            .insert(maintenanceAppointments)
            .values({
                userId: parseInt(userId),
                userCarId: parseInt(userCarId),
                serviceId: parseInt(serviceId),
                scheduledDate: new Date(scheduledDate),
                status: "scheduled",
                notes,
            })
            .returning();

        await db.insert(appointmentStatusUpdates).values({
            appointmentId: appointment.id,
            status: "scheduled",
            message: "Appointment scheduled successfully",
        });

        return NextResponse.json(appointment, { status: 201 });
    } catch (error) {
        console.error("Error creating appointment:", error);
        return NextResponse.json(
            { error: "Failed to create appointment" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        const appointments = await db
            .select({
                id: maintenanceAppointments.id,
                scheduledDate: maintenanceAppointments.scheduledDate,
                status: maintenanceAppointments.status,
                notes: maintenanceAppointments.notes,
                createdAt: maintenanceAppointments.createdAt,
                car: {
                    id: userCars.id,
                    nickname: userCars.nickname,
                    licensePlate: userCars.licensePlate,
                },
                service: {
                    id: services.id,
                    name: services.name,
                    description: services.description,
                    price: services.price,
                    durationMins: services.durationMins,
                },
            })
            .from(maintenanceAppointments)
            .leftJoin(userCars, eq(maintenanceAppointments.userCarId, userCars.id))
            .leftJoin(services, eq(maintenanceAppointments.serviceId, services.id))
            .where(eq(maintenanceAppointments.userId, parseInt(userId)))
            .orderBy(desc(maintenanceAppointments.scheduledDate));

        // Get status updates for each appointment
        const appointmentsWithUpdates = await Promise.all(
            appointments.map(async (appointment) => {
                const updates = await db
                    .select()
                    .from(appointmentStatusUpdates)
                    .where(eq(appointmentStatusUpdates.appointmentId, appointment.id))
                    .orderBy(desc(appointmentStatusUpdates.createdAt));

                return { ...appointment, statusUpdates: updates };
            })
        );

        return NextResponse.json(appointmentsWithUpdates);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json(
            { error: "Failed to fetch appointments" },
            { status: 500 }
        );
    }
}


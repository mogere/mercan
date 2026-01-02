import { db } from "../../../../../db";
import { services } from "../../../../../db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceId = parseInt(id);

    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const serviceId = parseInt(id);
    const body = await request.json();
    const { name, description, price, durationMins, imageUrl } = body;

    if (!name || !price || !imageUrl) {
      return NextResponse.json(
        { error: "Name, price, and image URL are required" },
        { status: 400 }
      );
    }

    const [updatedService] = await db
      .update(services)
      .set({
        name,
        description,
        price,
        durationMins,
        imageUrl,
      })
      .where(eq(services.id, serviceId))
      .returning();

    if (!updatedService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const serviceId = parseInt(id);

    const [deletedService] = await db
      .delete(services)
      .where(eq(services.id, serviceId))
      .returning();

    if (!deletedService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}

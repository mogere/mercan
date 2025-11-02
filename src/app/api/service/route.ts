import { db } from "../../../../db";
import { services } from "../../../../db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.select().from(services);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, price, durationMins, imageUrl } =
      await request.json();

    if (!name || !price || !imageUrl) {
      return NextResponse.json(
        { error: "Service name, price, and image URL are required" },
        { status: 400 }
      );
    }

    const [newService] = await db
      .insert(services)
      .values({
        name,
        description,
        price,
        durationMins,
        imageUrl,
      })
      .returning();

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

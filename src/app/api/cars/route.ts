import { db } from "../../../../db";
import { carMakes } from "../../../../db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.select().from(carMakes);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching car makes:", error);
    return NextResponse.json(
      { error: "Failed to fetch car makes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, logoUrl } = await request.json();

    if (!name || !logoUrl) {
      return NextResponse.json(
        { error: "Car make name and logo URL are required" },
        { status: 400 }
      );
    }
    const [newCarMake] = await db
      .insert(carMakes)
      .values({ name, logoUrl })
      .returning();

    return NextResponse.json(newCarMake, { status: 201 });
  } catch (error) {
    console.error("Error creating car make:", error);
    return NextResponse.json(
      { error: "Failed to create car make" },
      { status: 500 }
    );
  }
}

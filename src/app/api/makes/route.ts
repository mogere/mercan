import { NextResponse } from "next/server";
import { db } from "@/../db";
import { carMakes } from "@/../db/schema";

export async function GET() {
  try {
    const makes = await db.select().from(carMakes);
    return NextResponse.json(makes);
  } catch (error) {
    console.error("Error fetching makes:", error);
    return NextResponse.json(
      { error: "Failed to fetch makes" },
      { status: 500 }
    );
  }
}

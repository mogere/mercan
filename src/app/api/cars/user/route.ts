import { db } from "../../../../../db";
import { userCars, carGenerations, carModels, carMakes } from "../../../../../db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const { userId, carGenerationId, nickname, licensePlate } =
            await request.json();

        if (!userId || !carGenerationId) {
            return NextResponse.json(
                { error: "User ID and car generation ID are required" },
                { status: 400 }
            );
        }

        const [newCar] = await db
            .insert(userCars)
            .values({
                userId: parseInt(userId),
                carGenerationId: parseInt(carGenerationId),
                nickname,
                licensePlate,
            })
            .returning();

        return NextResponse.json(newCar, { status: 201 });
    } catch (error) {
        console.error("Error adding user car:", error);
        return NextResponse.json(
            { error: "Failed to add user car" },
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

        const cars = await db
            .select({
                id: userCars.id,
                nickname: userCars.nickname,
                licensePlate: userCars.licensePlate,
                createdAt: userCars.createdAt,
                genId: carGenerations.id,
                genName: carGenerations.name,
                genYearRange: carGenerations.yearRange,
                modelId: carModels.id,
                modelName: carModels.name,
                makeId: carMakes.id,
                makeName: carMakes.name,
            })
            .from(userCars)
            .leftJoin(carGenerations, eq(userCars.carGenerationId, carGenerations.id))
            .leftJoin(carModels, eq(carGenerations.modelId, carModels.id))
            .leftJoin(carMakes, eq(carModels.makeId, carMakes.id))
            .where(eq(userCars.userId, parseInt(userId)));

        const formatted = cars.map((car) => ({
            id: car.id,
            nickname: car.nickname,
            licensePlate: car.licensePlate,
            createdAt: car.createdAt,
            generation: {
                id: car.genId,
                name: car.genName,
                yearRange: car.genYearRange,
                model: {
                    id: car.modelId,
                    name: car.modelName,
                    make: {
                        id: car.makeId,
                        name: car.makeName,
                    },
                },
            },
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Error fetching user cars:", error);
        return NextResponse.json(
            { error: "Failed to fetch user cars" },
            { status: 500 }
        );
    }
}


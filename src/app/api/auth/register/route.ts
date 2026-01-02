import { NextRequest, NextResponse } from "next/server";
import { db } from "@/../db";
import { users } from "@/../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await db
            .insert(users)
            .values({
                name,
                email,
                passwordHash,
                role: "customer",
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
            });

        sendWelcomeEmail(email, name).catch((error) => {
            console.error("Failed to send welcome email:", error);
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                user: newUser[0],
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "An error occurred during registration" },
            { status: 500 }
        );
    }
}

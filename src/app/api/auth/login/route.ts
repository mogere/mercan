import { db } from "../../../../../db";
import { users } from "../../../../../db/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { sendLoginNotification } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!user || !user.passwordHash) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        sendLoginNotification(user.email, user.name, {
            ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
            userAgent: request.headers.get("user-agent") || undefined,
            timestamp: new Date(),
        }).catch((error) => {
            console.error("Failed to send login notification:", error);
        });

        const { passwordHash: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            user: userWithoutPassword,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json(
            { error: "Failed to login" },
            { status: 500 }
        );
    }
}


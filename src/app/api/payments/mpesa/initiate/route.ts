import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMpesaClient } from "@/lib/mpesa/client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, phone, amount } = body;

    if (!orderId || !phone || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get M-Pesa client
    const mpesaClient = getMpesaClient();

    // Get the base URL for callback
    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;
    const callbackUrl = `${baseUrl}/api/payments/mpesa/callback`;

    // Initiate STK push
    const result = await mpesaClient.initiateSTKPush({
      phone,
      amount,
      accountReference: `ORDER${orderId}`,
      transactionDesc: `Payment for Order #${orderId}`,
      callbackUrl,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        checkoutRequestId: result.checkoutRequestId,
        merchantRequestId: result.merchantRequestId,
        message: result.customerMessage || "STK push sent successfully. Please check your phone.",
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || "Failed to initiate M-Pesa payment",
      });
    }
  } catch (error) {
    console.error("M-Pesa initiate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process M-Pesa payment",
      },
      { status: 500 }
    );
  }
}

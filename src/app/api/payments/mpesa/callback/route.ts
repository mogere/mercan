import { NextRequest, NextResponse } from "next/server";
import { db } from "@/../db";
import { orders } from "@/../db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("M-Pesa Callback received:", JSON.stringify(body, null, 2));

    const { Body } = body;

    if (!Body || !Body.stkCallback) {
      console.error("Invalid callback structure");
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid callback" });
    }

    const { stkCallback } = Body;
    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = stkCallback;

    // Extract order ID from account reference or metadata
    let orderId: number | null = null;
    let mpesaReceiptNumber: string | null = null;
    let amount: number | null = null;
    let phoneNumber: string | null = null;

    if (CallbackMetadata && CallbackMetadata.Item) {
      for (const item of CallbackMetadata.Item) {
        switch (item.Name) {
          case "Amount":
            amount = item.Value;
            break;
          case "MpesaReceiptNumber":
            mpesaReceiptNumber = item.Value;
            break;
          case "PhoneNumber":
            phoneNumber = item.Value;
            break;
        }
      }
    }

    // Try to find the order - we'll need to store CheckoutRequestID when initiating payment
    // For now, we'll update based on phone number and amount (not ideal for production)

    if (ResultCode === 0) {
      // Payment successful
      console.log("Payment successful:", {
        CheckoutRequestID,
        mpesaReceiptNumber,
        amount,
        phoneNumber,
      });

      // Update order status
      // Note: In production, you should store CheckoutRequestID with the order
      // and use that to find the correct order

      // For now, we'll just log success
      // You would update the order here with:
      // await db.update(orders).set({
      //   paymentStatus: "paid",
      //   status: "confirmed",
      //   mpesaTransactionId: mpesaReceiptNumber,
      // }).where(eq(orders.id, orderId));

      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Success",
      });
    } else {
      // Payment failed
      console.error("Payment failed:", ResultDesc);

      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    return NextResponse.json({
      ResultCode: 1,
      ResultDesc: "Error processing callback",
    });
  }
}

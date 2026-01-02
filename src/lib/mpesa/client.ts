interface MpesaCredentials {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortcode: string;
  environment: "sandbox" | "production";
}

interface STKPushParams {
  phone: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
  callbackUrl: string;
}

export class MpesaClient {
  private credentials: MpesaCredentials;
  private baseUrl: string;

  constructor(credentials: MpesaCredentials) {
    this.credentials = credentials;
    this.baseUrl =
      credentials.environment === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${this.credentials.consumerKey}:${this.credentials.consumerSecret}`
    ).toString("base64");

    const response = await fetch(
      `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get M-Pesa access token");
    }

    const data = await response.json();
    return data.access_token;
  }

  private formatPhone(phone: string): string {
    // Remove any spaces, dashes, or plus signs
    let cleaned = phone.replace(/[\s\-\+]/g, "");

    // If starts with 0, replace with 254
    if (cleaned.startsWith("0")) {
      cleaned = "254" + cleaned.substring(1);
    }

    // If doesn't start with 254, add it
    if (!cleaned.startsWith("254")) {
      cleaned = "254" + cleaned;
    }

    return cleaned;
  }

  async initiateSTKPush(params: STKPushParams) {
    try {
      const token = await this.getAccessToken();
      const phone = this.formatPhone(params.phone);
      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, 14);
      const password = Buffer.from(
        `${this.credentials.shortcode}${this.credentials.passkey}${timestamp}`
      ).toString("base64");

      const payload = {
        BusinessShortCode: this.credentials.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.ceil(params.amount),
        PartyA: phone,
        PartyB: this.credentials.shortcode,
        PhoneNumber: phone,
        CallBackURL: params.callbackUrl,
        AccountReference: params.accountReference,
        TransactionDesc: params.transactionDesc,
      };

      const response = await fetch(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.ResponseCode === "0") {
        return {
          success: true,
          checkoutRequestId: data.CheckoutRequestID,
          merchantRequestId: data.MerchantRequestID,
          customerMessage: data.CustomerMessage,
        };
      } else {
        return {
          success: false,
          error: data.errorMessage || data.ResponseDescription || "STK push failed",
        };
      }
    } catch (error) {
      console.error("M-Pesa STK Push error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async querySTKPushStatus(checkoutRequestId: string) {
    try {
      const token = await this.getAccessToken();
      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, 14);
      const password = Buffer.from(
        `${this.credentials.shortcode}${this.credentials.passkey}${timestamp}`
      ).toString("base64");

      const payload = {
        BusinessShortCode: this.credentials.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };

      const response = await fetch(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("M-Pesa query error:", error);
      throw error;
    }
  }
}

export function getMpesaClient(): MpesaClient {
  const credentials: MpesaCredentials = {
    consumerKey: process.env.MPESA_CONSUMER_KEY || "",
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || "",
    passkey: process.env.MPESA_PASSKEY || "",
    shortcode: process.env.MPESA_SHORTCODE || "",
    environment:
      (process.env.MPESA_ENVIRONMENT as "sandbox" | "production") || "sandbox",
  };

  if (
    !credentials.consumerKey ||
    !credentials.consumerSecret ||
    !credentials.passkey ||
    !credentials.shortcode
  ) {
    throw new Error("M-Pesa credentials not configured");
  }

  return new MpesaClient(credentials);
}

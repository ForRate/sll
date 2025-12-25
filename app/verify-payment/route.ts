import prismaClient from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies, headers } from "next/headers";
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    // Get transaction ID sent from Flutterwave callback
    const transactionId = searchParams.get("transaction_id");

    if (!transactionId) {
      return Response.json(
        { error: "No transaction_id found" },
        { status: 400 }
      );
    }

    // Verify transaction with Flutterwave
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    const result = await verifyRes.json();

    if (result.status !== "success") {
      return Response.json(
        { error: "Verification failed", details: result },
        { status: 400 }
      );
    }

    // Extract payment details
    const amount = result.data.amount;
    const meta = result.data.meta;
    const date = result.data.created_at;

    // Return extracted data
    if (amount < 200) {
      return Response.json(
        {
          error: "Insufficient amount",
        },
        { status: 400 }
      );
    }
    const paymentTime = new Date(date).getTime();
    const expiryTime = paymentTime + 20 * 60 * 1000;

    if (Date.now() > expiryTime) {
      return Response.json({ error: "Transaction expired" }, { status: 400 });
    }

    const encryptedPassword = bcrypt.hashSync(
      meta.password,
      bcrypt.genSaltSync(10)
    );
    const userExist = await prismaClient.students.findFirst({
      where: { email: meta.email },
    });
    if (userExist) {
      return Response.json(
        {
          error: "Email already exists",
        },
        { status: 400 }
      );
    }
    await prismaClient.students.create({
      data: {
        email: meta.email,
        password: encryptedPassword,
      },
    });
    const headersList = await headers();

    const protocol = headersList.get("x-forwarded-proto") ?? "http";
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

    const baseUrl = `${protocol}://${host}`;
    (await cookies()).delete("hasLink");
    return Response.redirect(baseUrl);
  } catch (error) {
    return Response.json(
      { error: "Server Error", details: error },
      { status: 500 }
    );
  }
};

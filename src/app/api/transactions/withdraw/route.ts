import { NextRequest, NextResponse } from "next/server";
import { withdraw } from "@/features/transactions/services/transactionService";
import { withdrawSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = withdrawSchema.parse(body);

    const result = await withdraw({
      accountId: validated.accountId,
      amount: validated.amount.toString(),
      date: validated.date,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json(
        { status: apiError.status, message: apiError.message },
        { status: apiError.status }
      );
    }

    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json(
        { status: 422, message: "Validation failed", details: error },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { status: 500, message: error as string },
      { status: 500 }
    );
  }
}

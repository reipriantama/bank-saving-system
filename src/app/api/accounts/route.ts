import { NextRequest, NextResponse } from "next/server";
import {
  listAccounts,
  createAccount,
} from "@/features/accounts/services/accountService";
import { createAccountSchema } from "@/lib/validations";

export async function GET() {
  try {
    const accounts = await listAccounts();
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: error as string },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createAccountSchema.parse(body);

    const account = await createAccount({
      packet: validated.packet,
      balance: validated.balance.toString(),
      customerId: validated.customerId,
      depositoTypeId: validated.depositoTypeId,
    });
    return NextResponse.json(account, { status: 201 });
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

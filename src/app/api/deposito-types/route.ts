import { NextRequest, NextResponse } from "next/server";
import {
  listDepositoTypes,
  createDepositoType,
} from "@/features/deposito-types/services/depositoService";
import { createDepositoTypeSchema } from "@/lib/validations";

export async function GET() {
  try {
    const depositoTypes = await listDepositoTypes();
    return NextResponse.json(depositoTypes);
  } catch (error: unknown) {
    return NextResponse.json(
      { status: 500, message: error as string },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createDepositoTypeSchema.parse(body);

    const depositoType = await createDepositoType({
      name: validated.name,
      yearlyReturn: validated.yearlyReturn.toString(),
    });
    return NextResponse.json(depositoType, { status: 201 });
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

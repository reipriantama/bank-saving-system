import { NextRequest, NextResponse } from "next/server";
import {
  getDepositoTypeById,
  updateDepositoType,
  deleteDepositoType,
} from "@/features/deposito-types/services/depositoService";
import { updateDepositoTypeSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const depositoType = await getDepositoTypeById(id);
    return NextResponse.json(depositoType);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json(
        { status: apiError.status, message: apiError.message },
        { status: apiError.status }
      );
    }

    return NextResponse.json(
      { status: 500, message: error as string },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateDepositoTypeSchema.parse(body);

    const deposito = await updateDepositoType(id, validated);
    return NextResponse.json(deposito);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteDepositoType(id);
    return NextResponse.json({ message: "Deposito type deleted successfully" });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status: number; message: string };
      return NextResponse.json(
        { status: apiError.status, message: apiError.message },
        { status: apiError.status }
      );
    }

    return NextResponse.json(
      { status: 500, message: error as string },
      { status: 500 }
    );
  }
}

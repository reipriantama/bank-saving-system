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
    const depositoTypeId = parseInt(id, 10);

    if (isNaN(depositoTypeId)) {
      return NextResponse.json(
        { status: 400, message: "Invalid deposito type ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = updateDepositoTypeSchema.parse(body);

    const updateData: { name?: string; yearlyReturn?: string } = {};
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.yearlyReturn !== undefined)
      updateData.yearlyReturn = validated.yearlyReturn.toString();

    const depositoType = await updateDepositoType(id, updateData);
    return NextResponse.json(depositoType);
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
    const depositoTypeId = parseInt(id, 10);

    if (isNaN(depositoTypeId)) {
      return NextResponse.json(
        { status: 400, message: "Invalid deposito type ID" },
        { status: 400 }
      );
    }

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

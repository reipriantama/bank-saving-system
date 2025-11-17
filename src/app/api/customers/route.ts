import { NextRequest, NextResponse } from "next/server";
import {
  listCustomers,
  createCustomer,
} from "@/features/customers/services/customerService";
import { createCustomerSchema } from "@/lib/validations";

export async function GET() {
  try {
    const customers = await listCustomers();
    return NextResponse.json(customers);
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
    const validated = createCustomerSchema.parse(body);

    const customer = await createCustomer(validated);
    return NextResponse.json(customer, { status: 201 });
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

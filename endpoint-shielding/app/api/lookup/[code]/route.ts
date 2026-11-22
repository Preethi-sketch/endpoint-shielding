import { NextResponse } from "next/server";
import { SAMPLE_RECORDS } from "@/data/records";
import { toPublicLookupResponse } from "@/lib/masking";

export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  const normalizedCode = code.trim().toUpperCase();

  const record = SAMPLE_RECORDS.find((item) => item.code === normalizedCode);

  if (!record) {
    return NextResponse.json(
      { error: "Record not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(toPublicLookupResponse(record), { status: 200 });
}

import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_RECORDS } from "../../../../src/data/records";
import { toPublicLookupResponse } from "../../../../src/lib/masking";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  const normalizedCode = decodeURIComponent(code).trim().toUpperCase();

  if (!normalizedCode) {
    return NextResponse.json(
      { error: "Lookup code is required" },
      { status: 400 }
    );
  }

  const record = SAMPLE_RECORDS.find(
    (item) => item.code.toUpperCase() === normalizedCode
  );

  if (!record) {
    return NextResponse.json(
      { error: "Record not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(toPublicLookupResponse(record), { status: 200 });
}
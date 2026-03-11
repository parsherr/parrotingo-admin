import { getUnits } from "@/lib/units";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { units } = await getUnits();
        return NextResponse.json(units);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch units" }, { status: 500 });
    }
}

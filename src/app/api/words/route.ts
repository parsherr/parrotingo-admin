import { getWords } from "@/lib/github";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { words } = await getWords();
        return NextResponse.json(words);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch words" }, { status: 500 });
    }
}

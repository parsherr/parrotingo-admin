import { getUnits } from "@/lib/units";
import { getWords } from "@/lib/github";
import { getWordQuestions, getUnitQuestions } from "@/lib/questions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [{ units }, { words }, { data: wordQuestions }, { data: unitQuestions }] = await Promise.all([
            getUnits(),
            getWords(),
            getWordQuestions(),
            getUnitQuestions()
        ]);

        return NextResponse.json({
            units,
            words,
            wordQuestions,
            unitQuestions
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch curriculum data" }, { status: 500 });
    }
}

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

        // ---- NEW LOGIC: Alphabetical ordering of word IDs per unit ----
        // Build a map for quick lookup of word text by id
        const wordMap = new Map<string, string>();
        words.forEach((w) => wordMap.set(w.id, w.word));
        // For each unit, sort its wordIds based on the actual word string (case‑insensitive)
        units.forEach((unit) => {
            if (Array.isArray(unit.wordIds)) {
                unit.wordIds.sort((a, b) => {
                    const wa = wordMap.get(a) ?? "";
                    const wb = wordMap.get(b) ?? "";
                    return wa.localeCompare(wb, undefined, { sensitivity: "base" });
                });
            }
        });
        // -----------------------------------------------------------

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

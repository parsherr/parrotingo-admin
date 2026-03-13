import { NextResponse } from "next/server";
import { getUnits } from "@/lib/units";
import { getWordQuestions, getUnitQuestions } from "@/lib/questions";

export async function GET() {
    try {
        const { units } = await getUnits();
        const { data: wordQuestions } = await getWordQuestions();
        const { data: unitQuestions } = await getUnitQuestions();

        const summary = units.map((unit) => {
            let totalQuestions = 0;

            // Add questions from words in this unit
            unit.wordIds.forEach((wordId) => {
                const questions = wordQuestions[wordId] || [];
                totalQuestions += questions.length;
            });

            // Add unit-specific evaluation questions
            const evalQuestions = unitQuestions[unit.id] || [];
            totalQuestions += evalQuestions.length;

            return {
                ünite: unit.order,
                name: unit.title,
                questions: totalQuestions,
                id: unit.id // useful for internal lookups
            };
        });

        // Sort by unit order
        summary.sort((a, b) => a.ünite - b.ünite);

        return NextResponse.json(summary);
    } catch (error: any) {
        console.error("Error fetching units summary:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

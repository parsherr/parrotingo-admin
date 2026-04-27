import { getUnits } from "@/lib/units";
import { getUnitQuestions } from "@/lib/questions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [{ units }, { data: unitQuestions }] = await Promise.all([
            getUnits(),
            getUnitQuestions()
        ]);

        const result = units
            .map((unit) => {
                const questions = unitQuestions[unit.id] || [];
                return {
                    unitId: unit.id,
                    unitTitle: unit.title,
                    unitOrder: unit.order,
                    questionCount: questions.length,
                    questions
                };
            })
            .sort((a, b) => a.unitOrder - b.unitOrder);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch unit questions" }, { status: 500 });
    }
}

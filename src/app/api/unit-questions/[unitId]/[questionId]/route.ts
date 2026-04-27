import { getUnits } from "@/lib/units";
import { getUnitQuestions } from "@/lib/questions";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ unitId: string; questionId: string }> }
) {
    try {
        const { unitId, questionId } = await params;

        const [{ units }, { data: unitQuestions }] = await Promise.all([
            getUnits(),
            getUnitQuestions()
        ]);

        const unit = units.find((u) => u.id === unitId);
        if (!unit) {
            return NextResponse.json({ error: "Unit not found" }, { status: 404 });
        }

        const questions = unitQuestions[unitId] || [];
        const question = questions.find((q) => q.id === questionId);

        if (!question) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        return NextResponse.json({
            unitId: unit.id,
            unitTitle: unit.title,
            unitOrder: unit.order,
            question
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
    }
}

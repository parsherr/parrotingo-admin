import { getUnits } from "@/lib/units";
import { getUnitQuestions } from "@/lib/questions";
import { NextResponse } from "next/server";
import { QuestionType } from "@/types/questions";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ unitId: string }> }
) {
    try {
        const { unitId } = await params;
        const { searchParams } = new URL(request.url);
        const typeFilter = searchParams.get("type") as QuestionType | null;

        const [{ units }, { data: unitQuestions }] = await Promise.all([
            getUnits(),
            getUnitQuestions()
        ]);

        const unit = units.find((u) => u.id === unitId);
        if (!unit) {
            return NextResponse.json({ error: "Unit not found" }, { status: 404 });
        }

        let questions = unitQuestions[unitId] || [];
        if (typeFilter) {
            questions = questions.filter((q) => q.type === typeFilter);
        }

        return NextResponse.json({
            unitId: unit.id,
            unitTitle: unit.title,
            unitOrder: unit.order,
            questionCount: questions.length,
            questions
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch unit questions" }, { status: 500 });
    }
}

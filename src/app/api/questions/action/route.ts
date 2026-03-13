import { NextResponse } from "next/server";
import { getUnits } from "@/lib/units";
import { getWordQuestions, getUnitQuestions } from "@/lib/questions";
import { getFileData } from "@/lib/storage";
import { Word } from "@/types";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ünite, question } = body; // ünite is the order (1-based), question is the index (1-based as per user example)

        if (ünite === undefined || question === undefined) {
            return NextResponse.json({ error: "Missing ünite or question parameters" }, { status: 400 });
        }

        const { units } = await getUnits();
        const unit = units.find(u => u.order === ünite);

        if (!unit) {
            return NextResponse.json({ error: "Unit not found" }, { status: 404 });
        }

        const { data: wordQuestions } = await getWordQuestions();
        const { data: unitQuestions } = await getUnitQuestions();
        const { data: allWords } = await getFileData<Word[]>("data/words.json");

        // Flatten all questions in this unit's sequence
        const sequence: { word?: string, questionId: string, type: 'word' | 'unit' }[] = [];

        // 1. Add word-specific questions
        for (const wordId of unit.wordIds) {
            const wordData = allWords.find(w => w.id === wordId);
            const questions = wordQuestions[wordId] || [];
            questions.forEach(q => {
                sequence.push({
                    word: wordData?.word || "unknown",
                    questionId: q.id,
                    type: 'word'
                });
            });
        }

        // 2. Add unit-level evaluation questions
        const evalQuestions = unitQuestions[unit.id] || [];
        evalQuestions.forEach(q => {
            sequence.push({
                word: "Evaluation", // Or maybe just the unit name
                questionId: q.id,
                type: 'unit'
            });
        });

        // Get the question at the specified index (converting 1-based to 0-based)
        const target = sequence[question - 1];

        if (!target) {
            return NextResponse.json({ error: "Question index out of bounds" }, { status: 404 });
        }

        return NextResponse.json({
            word: target.word,
            questionId: target.questionId,
            type: target.type
        });
    } catch (error: any) {
        console.error("Error in questions action API:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

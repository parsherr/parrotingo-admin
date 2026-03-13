import { NextResponse } from "next/server";
import { getWordQuestions } from "@/lib/questions";
import { getFileData } from "@/lib/storage";
import { Word } from "@/types";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ word: string; id: string }> }
) {
    try {
        const { word: wordSlug, id: questionIdOrIndex } = await params;

        // 1. Find the word ID from the word text/slug
        const { data: allWords } = await getFileData<Word[]>("data/words.json");
        const wordData = allWords.find(w => w.word.toLowerCase() === wordSlug.toLowerCase());

        if (!wordData) {
            return NextResponse.json({ error: "Word not found" }, { status: 404 });
        }

        // 2. Get questions for this word
        const { data: wordQuestions } = await getWordQuestions();
        const questions = wordQuestions[wordData.id] || [];

        // 3. Find the specific question
        // Try as Index if it's a number, otherwise try as ID
        let question;
        const index = parseInt(questionIdOrIndex);

        if (!isNaN(index) && index > 0 && index <= questions.length) {
            question = questions[index - 1];
        } else {
            question = questions.find(q => q.id === questionIdOrIndex);
        }

        if (!question) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        return NextResponse.json({
            word: wordData.word,
            question: question
        });
    } catch (error: any) {
        console.error("Error fetching word question detail:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

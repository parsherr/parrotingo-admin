import { getWords } from "@/lib/github";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { word: string } }
) {
    try {
        const { word } = await params;
        const { words } = await getWords();
        const foundWord = words.find(
            (w) => w.word.toLowerCase() === word.toLowerCase()
        );

        if (!foundWord) {
            return NextResponse.json({ error: "Word not found" }, { status: 404 });
        }

        return NextResponse.json(foundWord);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch word" }, { status: 500 });
    }
}

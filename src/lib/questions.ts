import { getFileData, updateFileData } from "./storage";
import { Question, WordQuestionsData, UnitQuestionsData } from "@/types/questions";

const WORD_QUESTIONS_PATH = "data/word_questions.json";
const UNIT_QUESTIONS_PATH = "data/unit_questions.json";

// Word-specific questions
export async function getWordQuestions(): Promise<{ data: WordQuestionsData; sha: string }> {
    const { data, sha } = await getFileData<WordQuestionsData>(WORD_QUESTIONS_PATH);
    return { data: (data && typeof data === 'object' && !Array.isArray(data)) ? data : {}, sha };
}

export async function updateWordQuestions(data: WordQuestionsData, sha?: string): Promise<string> {
    return updateFileData(WORD_QUESTIONS_PATH, data, sha, "Update word questions");
}

// Unit-specific evaluation questions
export async function getUnitQuestions(): Promise<{ data: UnitQuestionsData; sha: string }> {
    const { data, sha } = await getFileData<UnitQuestionsData>(UNIT_QUESTIONS_PATH);
    return { data: (data && typeof data === 'object' && !Array.isArray(data)) ? data : {}, sha };
}

export async function updateUnitQuestions(data: UnitQuestionsData, sha?: string): Promise<string> {
    return updateFileData(UNIT_QUESTIONS_PATH, data, sha, "Update unit evaluation questions");
}

// Legacy helper (if still needed anywhere, can be mapped to one of the above or removed)
export async function getQuestions() {
    // For now, let's just return an empty array to avoid breaking things immediately
    return { questions: [], sha: "" };
}
export async function updateQuestions(questions: any[], sha?: string) {
    return "";
}

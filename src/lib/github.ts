import { getFileData, updateFileData } from "./storage";
import { Word } from "@/types";

const DATA_PATH = "data/words.json";

export async function getWords(): Promise<{ words: Word[]; sha: string }> {
    const { data, sha } = await getFileData<Word[]>(DATA_PATH);
    // Ensure we always return an array even if file was empty/missing
    return { words: Array.isArray(data) ? data : [], sha };
}

export async function updateWords(words: Word[], sha?: string): Promise<string> {
    return updateFileData(DATA_PATH, words, sha, "Update dictionary words");
}

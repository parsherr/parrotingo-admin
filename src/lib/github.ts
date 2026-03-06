import { Octokit } from "@octokit/rest";
import { Word } from "@/types";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const DATA_PATH = "data/words.json";

const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

export async function getWords(): Promise<{ words: Word[]; sha: string }> {
    try {
        const { data }: any = await octokit.repos.getContent({
            owner: GITHUB_OWNER!,
            repo: GITHUB_REPO!,
            path: DATA_PATH,
        });

        const content = Buffer.from(data.content, "base64").toString("utf-8");
        return {
            words: JSON.parse(content),
            sha: data.sha,
        };
    } catch (error: any) {
        if (error.status === 404) {
            // File doesn't exist yet, return empty list
            return { words: [], sha: "" };
        }
        throw error;
    }
}

export async function updateWords(words: Word[], sha?: string): Promise<string> {
    const content = JSON.stringify(words, null, 2);
    const base64Content = Buffer.from(content).toString("base64");

    const response = await octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_OWNER!,
        repo: GITHUB_REPO!,
        path: DATA_PATH,
        message: "Update dictionary words",
        content: base64Content,
        sha: sha,
    });

    return response.data.content?.sha || "";
}

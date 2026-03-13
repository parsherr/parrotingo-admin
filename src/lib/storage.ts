import { Octokit } from "@octokit/rest";
import fs from "fs/promises";
import path from "path";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_OWNER = process.env.GITHUB_OWNER;

const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

const IS_DEV = process.env.NODE_ENV === "development";

export async function getFileData<T>(filePath: string): Promise<{ data: T; sha: string }> {
    // Try local file first in development
    if (IS_DEV) {
        try {
            const fullPath = path.join(process.cwd(), filePath);
            const content = await fs.readFile(fullPath, "utf-8");
            return {
                data: JSON.parse(content),
                sha: "local-dev", // SHA doesn't matter for local
            };
        } catch (error: any) {
            console.log(`Local file ${filePath} not found, trying GitHub...`);
        }
    }

    try {
        const { data }: any = await octokit.repos.getContent({
            owner: GITHUB_OWNER!,
            repo: GITHUB_REPO!,
            path: filePath,
        });

        const content = Buffer.from(data.content, "base64").toString("utf-8");

        // In dev, if we fetched from GitHub but didn't have it locally, save it locally too
        if (IS_DEV) {
            const fullPath = path.join(process.cwd(), filePath);
            await fs.mkdir(path.dirname(fullPath), { recursive: true });
            await fs.writeFile(fullPath, content, "utf-8");
        }

        return {
            data: JSON.parse(content),
            sha: data.sha,
        };
    } catch (error: any) {
        if (error.status === 404) {
            return { data: [] as unknown as T, sha: "" };
        }
        throw error;
    }
}

export async function updateFileData(filePath: string, content: any, sha?: string, message: string = "Update data"): Promise<string> {
    const jsonContent = JSON.stringify(content, null, 2);

    // 1. Update Local Filesystem
    try {
        const fullPath = path.join(process.cwd(), filePath);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, jsonContent, "utf-8");
        console.log(`Successfully updated local file: ${filePath}`);
    } catch (error) {
        console.error(`Error updating local file ${filePath}:`, error);
        // We continue to update GitHub even if local fails (or vice versa depending on policy)
    }

    // 2. Update GitHub
    try {
        const base64Content = Buffer.from(jsonContent).toString("base64");
        const response = await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER!,
            repo: GITHUB_REPO!,
            path: filePath,
            message: message,
            content: base64Content,
            sha: sha || undefined,
        });
        return response.data.content?.sha || "";
    } catch (error) {
        console.error(`Error updating GitHub file ${filePath}:`, error);
        return "";
    }
}


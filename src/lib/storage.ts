import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_OWNER = process.env.GITHUB_OWNER;

const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

export async function getFileData<T>(path: string): Promise<{ data: T; sha: string }> {
    try {
        const { data }: any = await octokit.repos.getContent({
            owner: GITHUB_OWNER!,
            repo: GITHUB_REPO!,
            path: path,
        });

        const content = Buffer.from(data.content, "base64").toString("utf-8");
        return {
            data: JSON.parse(content),
            sha: data.sha,
        };
    } catch (error: any) {
        if (error.status === 404) {
            // Return appropriate empty structure based on expected type if possible, 
            // but for safety we return null or empty array/object in callers
            return { data: [] as unknown as T, sha: "" };
        }
        throw error;
    }
}

export async function updateFileData(path: string, content: any, sha?: string, message: string = "Update data"): Promise<string> {
    const jsonContent = JSON.stringify(content, null, 2);
    const base64Content = Buffer.from(jsonContent).toString("base64");

    const response = await octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_OWNER!,
        repo: GITHUB_REPO!,
        path: path,
        message: message,
        content: base64Content,
        sha: sha || undefined,
    });

    return response.data.content?.sha || "";
}

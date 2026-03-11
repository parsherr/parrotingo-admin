import { getFileData, updateFileData } from "./storage";
import { Unit } from "@/types";

const DATA_PATH = "data/units.json";

export async function getUnits(): Promise<{ units: Unit[]; sha: string }> {
    const { data, sha } = await getFileData<Unit[]>(DATA_PATH);
    return { units: Array.isArray(data) ? data : [], sha };
}

export async function updateUnits(units: Unit[], sha?: string): Promise<string> {
    return updateFileData(DATA_PATH, units, sha, "Update units");
}

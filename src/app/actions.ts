"use server";

import { getWords, updateWords } from "@/lib/github";
import { Word } from "@/types";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { login, logout, isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function fetchWordsAction() {
    const { words } = await getWords();
    return words;
}

export async function createWordAction(wordData: Omit<Word, "id">) {
    const { words, sha } = await getWords();
    const newWord: Word = {
        ...wordData,
        id: nanoid(10),
    };

    const updatedWords = [...words, newWord];
    await updateWords(updatedWords, sha);
    revalidatePath("/dashboard");
    return newWord;
}

export async function updateWordAction(updatedWord: Word) {
    const { words, sha } = await getWords();
    const updatedWords = words.map((w) => (w.id === updatedWord.id ? updatedWord : w));

    await updateWords(updatedWords, sha);
    revalidatePath("/dashboard");
    return updatedWord;
}

export async function deleteWordAction(id: string) {
    const { words, sha } = await getWords();
    const updatedWords = words.filter((w) => w.id !== id);

    await updateWords(updatedWords, sha);
    revalidatePath("/dashboard");
    return { success: true };
}

export async function loginAction(formData: FormData) {
    const password = formData.get("password") as string;
    const success = await login(password);
    if (success) {
        redirect("/dashboard");
    }
    return { error: "Hatalı şifre" };
}

export async function logoutAction() {
    await logout();
    redirect("/login");
}

export async function checkAuthAction() {
    return await isAuthenticated();
}

"use server";

import { getWords, updateWords } from "@/lib/github";
import { getQuestions, updateQuestions } from "@/lib/questions";
import { Word } from "@/types";
import { Question } from "@/types/questions";
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
    redirect("/admin");
}

export async function checkAuthAction() {
    return await isAuthenticated();
}

// Question actions
export async function fetchQuestionsAction() {
    const { questions } = await getQuestions();
    return questions;
}

export async function createQuestionAction(questionData: Omit<Question, "id">) {
    const { questions, sha } = await getQuestions();
    const newQuestion: Question = {
        ...(questionData as any),
        id: nanoid(10),
    };

    const updatedQuestions = [...questions, newQuestion];
    await updateQuestions(updatedQuestions, sha);
    revalidatePath("/dashboard");
    return newQuestion;
}

export async function updateQuestionAction(updatedQuestion: Question) {
    const { questions, sha } = await getQuestions();
    const updatedQuestions = questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q));

    await updateQuestions(updatedQuestions, sha);
    revalidatePath("/dashboard");
    return updatedQuestion;
}

export async function deleteQuestionAction(id: string) {
    const { questions, sha } = await getQuestions();
    const updatedQuestions = questions.filter((q) => q.id !== id);

    await updateQuestions(updatedQuestions, sha);
    revalidatePath("/dashboard");
    return { success: true };
}

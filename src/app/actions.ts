"use server";

import { getWords, updateWords } from "@/lib/github";
import {
    getWordQuestions,
    updateWordQuestions,
    getUnitQuestions,
    updateUnitQuestions
} from "@/lib/questions";
import { getUnits, updateUnits } from "@/lib/units";
import { Word, Unit } from "@/types";
import { Question } from "@/types/questions";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { login, logout, isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

// --- WORD ACTIONS ---
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

// --- UNIT ACTIONS ---
export async function fetchUnitsAction() {
    const { units } = await getUnits();
    return units;
}

export async function createUnitAction(unitData: Omit<Unit, "id" | "wordIds">) {
    const { units, sha } = await getUnits();
    const newUnit: Unit = {
        ...unitData,
        id: nanoid(10),
        wordIds: [],
    };
    const updatedUnits = [...units, newUnit];
    await updateUnits(updatedUnits, sha);
    revalidatePath("/dashboard");
    return newUnit;
}

export async function updateUnitAction(updatedUnit: Unit) {
    const { units, sha } = await getUnits();
    const updatedUnits = units.map((u) => (u.id === updatedUnit.id ? updatedUnit : u));
    await updateUnits(updatedUnits, sha);
    revalidatePath("/dashboard");
    return updatedUnit;
}

export async function deleteUnitAction(id: string) {
    const { units, sha } = await getUnits();
    const updatedUnits = units.filter((u) => u.id !== id);
    await updateUnits(updatedUnits, sha);
    revalidatePath("/dashboard");
    return { success: true };
}

// --- WORD QUESTION ACTIONS ---
export async function fetchWordQuestionsAction(wordId: string) {
    const { data } = await getWordQuestions();
    return data[wordId] || [];
}

export async function saveWordQuestionAction(wordId: string, question: Question) {
    const { data: allData, sha } = await getWordQuestions();
    const currentWordQuestions = allData[wordId] || [];

    let updatedWordQuestions;
    if (question.id === "temp" || !question.id) {
        // Create
        updatedWordQuestions = [...currentWordQuestions, { ...question, id: nanoid(10) }];
    } else {
        // Update
        updatedWordQuestions = currentWordQuestions.map(q => q.id === question.id ? question : q);
    }

    allData[wordId] = updatedWordQuestions;
    await updateWordQuestions(allData, sha);
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteWordQuestionAction(wordId: string, questionId: string) {
    const { data: allData, sha } = await getWordQuestions();
    if (allData[wordId]) {
        allData[wordId] = allData[wordId].filter(q => q.id !== questionId);
        await updateWordQuestions(allData, sha);
        revalidatePath("/dashboard");
    }
    return { success: true };
}

// --- UNIT EVALUATION QUESTION ACTIONS ---
export async function fetchUnitQuestionsAction(unitId: string) {
    const { data } = await getUnitQuestions();
    return data[unitId] || [];
}

export async function saveUnitQuestionAction(unitId: string, question: Question) {
    const { data: allData, sha } = await getUnitQuestions();
    const currentUnitQuestions = allData[unitId] || [];

    let updatedUnitQuestions;
    if (question.id === "temp" || !question.id) {
        updatedUnitQuestions = [...currentUnitQuestions, { ...question, id: nanoid(10) }];
    } else {
        updatedUnitQuestions = currentUnitQuestions.map(q => q.id === question.id ? question : q);
    }

    allData[unitId] = updatedUnitQuestions;
    await updateUnitQuestions(allData, sha);
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteUnitQuestionAction(unitId: string, questionId: string) {
    const { data: allData, sha } = await getUnitQuestions();
    if (allData[unitId]) {
        allData[unitId] = allData[unitId].filter(q => q.id !== questionId);
        await updateUnitQuestions(allData, sha);
        revalidatePath("/dashboard");
    }
    return { success: true };
}

// --- AUTH ACTIONS ---
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

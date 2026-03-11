export type QuestionType = "gap-fill" | "word-meaning" | "multiple-gap";

export interface GapFillQuestion {
    id: string;
    type: "gap-fill";
    sentence: string; // "I really [WORD] playing football."
    correctWord: string;
    wrongWords: string[]; // 3 distractors
}

export interface WordMeaningQuestion {
    id: string;
    type: "word-meaning";
    word: string;
    correctTranslation: string;
    correctDefinition: string;
    wrongChoices: string[]; // 3 distractors
}

export interface MultipleGapQuestion {
    id: string;
    type: "multiple-gap";
    text: string; // "She [GAP1] to the store and [GAP2] some milk."
    gaps: {
        id: string; // GAP1, GAP2
        correctWord: string;
        wrongWords: string[]; // 2 distractors
    }[];
}

export type Question = GapFillQuestion | WordMeaningQuestion | MultipleGapQuestion;

// These represent how data is stored in different JSON files
export type WordQuestionsData = Record<string, Question[]>; // Key: wordId
export type UnitQuestionsData = Record<string, Question[]>; // Key: unitId

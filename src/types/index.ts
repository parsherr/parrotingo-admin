export interface Word {
    id: string;
    word: string;
    definition: string;
    definition_tr: string;
}

export interface Unit {
    id: string;
    title: string;
    order: number;
    wordIds: string[]; // List of Word IDs in this unit
}

export interface DictionaryData {
    words: Word[];
}

export interface UnitsData {
    units: Unit[];
}

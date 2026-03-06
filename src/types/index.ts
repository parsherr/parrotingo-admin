export interface Word {
    id: string;
    word: string;
    definition: string;
    definition_tr: string;
}

export interface DictionaryData {
    words: Word[];
}

"use client";

import { useState } from "react";
import { Word } from "@/types";
import { createWordAction, updateWordAction, deleteWordAction } from "@/app/actions";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

interface WordListProps {
    initialWords: Word[];
}

export default function WordList({ initialWords }: WordListProps) {
    const [words, setWords] = useState<Word[]>(initialWords);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWord, setEditingWord] = useState<Word | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const filteredWords = words.filter((w) =>
        w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.definition_tr.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.word.localeCompare(b.word));

    const handleCreateOrUpdate = async (formData: FormData) => {
        const wordData = {
            word: formData.get("word") as string,
            definition: formData.get("definition") as string,
            definition_tr: formData.get("definition_tr") as string,
        };

        if (editingWord) {
            const updated = await updateWordAction({ ...wordData, id: editingWord.id });
            setWords(words.map((w) => (w.id === updated.id ? updated : w)));
        } else {
            const created = await createWordAction(wordData);
            setWords([...words, created]);
        }

        setIsModalOpen(false);
        setEditingWord(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bu kelimeyi silmek istediğinize emin misiniz?")) {
            await deleteWordAction(id);
            setWords(words.filter((w) => w.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Search and Add */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Kelime ara..."
                        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => {
                        setEditingWord(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Yeni Kelime Ekle
                </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Kelime</th>
                                <th className="px-6 py-4">Tanım (EN)</th>
                                <th className="px-6 py-4">Tanım (TR)</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredWords.length > 0 ? (
                                filteredWords.map((word) => (
                                    <tr key={word.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="whitespace-nowrap px-6 py-4 font-bold text-gray-900">{word.word}</td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{word.definition}</td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{word.definition_tr}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingWord(word);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition-all"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(word.id)}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                        Henüz kelime bulunamadı veya arama sonucu yok.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - Shadcn UI lookalike */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingWord ? "Kelimeyi Düzenle" : "Yeni Kelime Ekle"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form action={handleCreateOrUpdate} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Kelime</label>
                                <input
                                    name="word"
                                    defaultValue={editingWord?.word || ""}
                                    required
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="Örn: Serendipity"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">İngilizce Tanım</label>
                                <textarea
                                    name="definition"
                                    defaultValue={editingWord?.definition || ""}
                                    required
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="İngilizce açıklama girin..."
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Türkçe Tanım</label>
                                <textarea
                                    name="definition_tr"
                                    defaultValue={editingWord?.definition_tr || ""}
                                    required
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="Türkçe açıklama girin..."
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                                >
                                    {editingWord ? "Güncelle" : "Ekle"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

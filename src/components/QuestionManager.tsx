"use client";

import { useState } from "react";
import { Question, GapFillQuestion, WordMeaningQuestion, MultipleGapQuestion } from "@/types/questions";
import { Word } from "@/types";
import { createQuestionAction, updateQuestionAction, deleteQuestionAction } from "@/app/actions";
import { Plus, Pencil, Trash2, Search, X, Brain, Layers, MousePointer2, Wand2 } from "lucide-react";

interface QuestionManagerProps {
    initialQuestions: Question[];
    words: Word[];
}

export default function QuestionManager({ initialQuestions, words }: QuestionManagerProps) {
    const [questions, setQuestions] = useState<Question[]>(initialQuestions);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [activeType, setActiveType] = useState<"gap-fill" | "word-meaning" | "multiple-gap">("gap-fill");

    const filteredQuestions = questions.filter((q) => {
        const matchesSearch = JSON.stringify(q).toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleDelete = async (id: string) => {
        if (confirm("Bu soruyu silmek istediğinize emin misiniz?")) {
            await deleteQuestionAction(id);
            setQuestions(questions.filter((q) => q.id !== id));
        }
    };

    const handleSave = (newQuestion: Question) => {
        if (editingQuestion) {
            setQuestions(questions.map(q => q.id === newQuestion.id ? newQuestion : q));
        } else {
            setQuestions([...questions, newQuestion]);
        }
        setIsModalOpen(false);
        setEditingQuestion(null);
    };

    return (
        <div className="space-y-6">
            {/* Common Datalist for all forms */}
            <datalist id="words-list">
                {words.map(w => <option key={w.id} value={w.word} />)}
            </datalist>

            {/* Search and Add */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Sorularda ara..."
                        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setEditingQuestion(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Yeni Soru Ekle
                    </button>
                </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((q) => (
                        <QuestionCard
                            key={q.id}
                            question={q}
                            onEdit={(q) => {
                                setEditingQuestion(q);
                                setActiveType(q.type);
                                setIsModalOpen(true);
                            }}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-xl border border-gray-100 shadow-sm text-gray-500">
                        Henüz soru bulunamadı.
                    </div>
                )}
            </div>

            {/* Question Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-2xl rounded-2xl bg-white p-0 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="p-6 border-b flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingQuestion ? "Soruyu Düzenle" : "Yeni Soru Oluştur"}
                                </h3>
                                <p className="text-sm text-gray-500">Soru detaylarını ve cevaplarını belirleyin.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-white hover:text-gray-600 transition-colors shadow-sm bg-white/50">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Type Selector */}
                        {!editingQuestion && (
                            <div className="px-6 py-4 bg-indigo-50/30 border-b">
                                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Soru Tipi Seçin</label>
                                <div className="flex gap-2">
                                    {[
                                        { id: 'gap-fill', label: 'Boşluk Doldurma', icon: MousePointer2 },
                                        { id: 'word-meaning', label: 'Kelime-Anlam', icon: Brain },
                                        { id: 'multiple-gap', label: 'Metin & Çoklu Boşluk', icon: Layers }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setActiveType(type.id as any)}
                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all ${activeType === type.id
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                                    : 'bg-white border-gray-100 text-gray-600 hover:border-indigo-200'
                                                }`}
                                        >
                                            <type.icon className={`h-4 w-4 ${activeType === type.id ? 'text-white' : 'text-indigo-500'}`} />
                                            <span className="text-xs font-bold">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Form Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            {activeType === 'gap-fill' && <GapFillForm onSave={handleSave} initialData={editingQuestion as GapFillQuestion} words={words} />}
                            {activeType === 'word-meaning' && <WordMeaningForm onSave={handleSave} initialData={editingQuestion as WordMeaningQuestion} words={words} />}
                            {activeType === 'multiple-gap' && <MultipleGapForm onSave={handleSave} initialData={editingQuestion as MultipleGapQuestion} words={words} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function QuestionCard({ question, onEdit, onDelete }: { question: Question, onEdit: (q: Question) => void, onDelete: (id: string) => void }) {
    const typeLabel = { 'gap-fill': 'Boşluk Doldurma', 'word-meaning': 'Kelime-Anlam', 'multiple-gap': 'Çoklu Boşluk' };
    const typeColor = { 'gap-fill': 'bg-blue-50 text-blue-600', 'word-meaning': 'bg-purple-50 text-purple-600', 'multiple-gap': 'bg-orange-50 text-orange-600' };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${typeColor[question.type]}`}>
                    {typeLabel[question.type]}
                </span>
                <div className="flex gap-1">
                    <button onClick={() => onEdit(question)} className="p-1.5 rounded-lg text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => onDelete(question.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
            </div>
            <div className="flex-1">
                <p className="text-gray-900 font-medium line-clamp-3 mb-4">
                    {question.type === 'gap-fill' && question.sentence.replace('[WORD]', '____')}
                    {question.type === 'word-meaning' && `Anlam Eşleştir: ${question.word}`}
                    {question.type === 'multiple-gap' && question.text.replace(/\[GAP\d+\]/g, '____')}
                </p>
                <div className="text-xs text-gray-500">ID: {question.id}</div>
            </div>
        </div>
    );
}

// ---------------- FORM COMPONENTS ----------------

function GapFillForm({ onSave, initialData, words }: { onSave: (q: Question) => void, initialData?: GapFillQuestion, words: Word[] }) {
    const [sentence, setSentence] = useState(initialData?.sentence || "");
    const [correctWord, setCorrectWord] = useState(initialData?.correctWord || "");
    const [wrongWords, setWrongWords] = useState<string[]>(initialData?.wrongWords || ["", "", ""]);
    const [isLoading, setIsLoading] = useState(false);

    const generateDistractors = () => {
        if (!correctWord) return alert("Lütfen önce doğru kelimeyi belirleyin.");
        const others = words.filter(w => w.word.toLowerCase() !== correctWord.toLowerCase()).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.word);
        setWrongWords(others);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const data = { type: "gap-fill" as const, sentence, correctWord, wrongWords };
        const result = initialData ? await updateQuestionAction({ ...data, id: initialData.id }) : await createQuestionAction(data);
        onSave(result);
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Cümle ([WORD] kullanarak boşluğu belirtin)</label>
                <textarea required value={sentence} onChange={(e) => setSentence(e.target.value)} className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[100px]" placeholder="Örn: Gravity [WORD] things to the ground." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Doğru Kelime</label>
                    <input list="words-list" required value={correctWord} onChange={(e) => setCorrectWord(e.target.value)} className="w-full rounded-xl border border-indigo-200 bg-indigo-50/30 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold" placeholder="Doğru cevap" />
                </div>
                <div className="flex items-end">
                    <button type="button" onClick={generateDistractors} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl transition-all"><Wand2 className="h-4 w-4 text-indigo-500" /> Rastgele Yanlış Şıklar</button>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
                {wrongWords.map((word, idx) => (
                    <div key={idx} className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Yanlış Şık {idx + 1}</label>
                        <input list="words-list" required value={word} onChange={(e) => { const nw = [...wrongWords]; nw[idx] = e.target.value; setWrongWords(nw); }} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                ))}
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all">{isLoading ? "Kaydediliyor..." : (initialData ? "Güncelle" : "Soru Oluştur")}</button>
        </form>
    );
}

function WordMeaningForm({ onSave, initialData, words }: { onSave: (q: Question) => void, initialData?: WordMeaningQuestion, words: Word[] }) {
    const [word, setWord] = useState(initialData?.word || "");
    const [correctTranslation, setCorrectTranslation] = useState(initialData?.correctTranslation || "");
    const [correctDefinition, setCorrectDefinition] = useState(initialData?.correctDefinition || "");
    const [wrongChoices, setWrongChoices] = useState<string[]>(initialData?.wrongChoices || ["", "", ""]);
    const [isLoading, setIsLoading] = useState(false);

    const handleWordSelect = async (selectedWord: string) => {
        setWord(selectedWord);
        if (!selectedWord) return;
        try {
            const res = await fetch(`/api/words/${encodeURIComponent(selectedWord)}`);
            if (res.ok) {
                const wordObj = await res.json();
                setCorrectTranslation(wordObj.definition_tr);
                setCorrectDefinition(wordObj.definition);
            }
        } catch (e) { console.error(e); }
    };

    const generateDistractors = () => {
        if (!word) return alert("Lütfen önce bir kelime seçin.");
        const dists = words.filter(w => w.word !== word).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.word);
        setWrongChoices(dists);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const data = { type: "word-meaning" as const, word, correctTranslation, correctDefinition, wrongChoices };
        const result = initialData ? await updateQuestionAction({ ...data, id: initialData.id }) : await createQuestionAction(data);
        onSave(result);
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Hedef Kelime (İngilizce)</label>
                <input list="words-list" required value={word} onChange={(e) => handleWordSelect(e.target.value)} className="w-full rounded-xl border border-indigo-200 bg-indigo-50/30 px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Örn: Abundant" />
            </div>
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Türkçe Karşılık</label><input required value={correctTranslation} onChange={(e) => setCorrectTranslation(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div>
                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">İngilizce Tanım</label><textarea required value={correctDefinition} onChange={(e) => setCorrectDefinition(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm min-h-[60px]" /></div>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center"><label className="text-sm font-bold text-gray-700">Yanlış Seçenekler (Diğer Kelimeler)</label><button type="button" onClick={generateDistractors} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"><Wand2 className="h-3 w-3" /> Rastgele Kelime Getir</button></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {wrongChoices.map((choice, idx) => (
                        <div key={idx} className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Yanlış Kelime {idx + 1}</label>
                            <input list="words-list" required value={choice} onChange={(e) => { const nc = [...wrongChoices]; nc[idx] = e.target.value; setWrongChoices(nc); }} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
                        </div>
                    ))}
                </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all"> {isLoading ? "Kaydediliyor..." : (initialData ? "Güncelle" : "Soru Oluştur")} </button>
        </form>
    );
}

function MultipleGapForm({ onSave, initialData, words }: { onSave: (q: Question) => void, initialData?: MultipleGapQuestion, words: Word[] }) {
    const [text, setText] = useState(initialData?.text || "");
    const [gaps, setGaps] = useState(initialData?.gaps || [{ id: "GAP1", correctWord: "", wrongWords: ["", ""] }]);
    const [isLoading, setIsLoading] = useState(false);

    const generateDistractors = (idx: number) => {
        const correct = gaps[idx].correctWord;
        if (!correct) return alert("Hata: Önce bu boşluk için doğru kelimeyi seçmelisiniz.");
        const dists = words.filter(w => w.word !== correct).sort(() => Math.random() - 0.5).slice(0, 2).map(w => w.word);
        const ng = [...gaps]; ng[idx].wrongWords = dists; setGaps(ng);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const data = { type: "multiple-gap" as const, text, gaps };
        const result = initialData ? await updateQuestionAction({ ...data, id: initialData.id }) : await createQuestionAction(data);
        onSave(result);
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex justify-between">Metin (Boşluklar için [GAP1], [GAP2] kullanın)</label>
                <textarea required value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-xl border border-gray-200 p-4 text-sm min-h-[100px]" placeholder="Örn: Tomorrow [GAP1] be better than [GAP2]." />
            </div>
            <div className="space-y-4">
                {gaps.map((gap, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                        <div className="flex justify-between items-center"><h4 className="text-sm font-bold text-indigo-700">Boşluk {idx + 1} ({gap.id})</h4>{gaps.length > 1 && <button type="button" onClick={() => setGaps(gaps.filter((_, i) => i !== idx))} className="text-red-500"><X className="h-4 w-4" /></button>}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500">Doğru Kelime</label>
                                <input list="words-list" required value={gap.correctWord} onChange={(e) => { const ng = [...gaps]; ng[idx].correctWord = e.target.value; setGaps(ng); }} className="w-full rounded-lg border border-indigo-200 bg-indigo-50/30 px-3 py-2 text-sm font-bold" />
                            </div>
                            <div className="flex items-end">
                                <button type="button" onClick={() => generateDistractors(idx)} className="w-full text-xs font-bold text-indigo-600 bg-white border border-indigo-100 hover:bg-indigo-50 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"><Wand2 className="h-3 w-3" /> Diğer 2 Şıkkı Doldur</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {gap.wrongWords.map((ww, wIdx) => (
                                <div key={wIdx} className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Yanlış Şık {wIdx + 1}</label>
                                    <input list="words-list" required value={ww} onChange={(e) => { const ng = [...gaps]; ng[idx].wrongWords[wIdx] = e.target.value; setGaps(ng); }} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {gaps.length < 2 && <button type="button" onClick={() => setGaps([...gaps, { id: `GAP${gaps.length + 1}`, correctWord: "", wrongWords: ["", ""] }])} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm hover:border-indigo-300 hover:text-indigo-500 transition-all">+ Boşluk Ekle</button>}
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all">{isLoading ? "Kaydediliyor..." : (initialData ? "Güncelle" : "Soru Oluştur")}</button>
        </form>
    );
}

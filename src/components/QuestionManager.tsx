"use client";

import { useState, useEffect } from "react";
import { Question, GapFillQuestion, WordMeaningQuestion, MultipleGapQuestion } from "@/types/questions";
import { Word, Unit } from "@/types";
import {
    fetchWordQuestionsAction,
    saveWordQuestionAction,
    deleteWordQuestionAction,
    fetchUnitQuestionsAction,
    saveUnitQuestionAction,
    deleteUnitQuestionAction
} from "@/app/actions";
import {
    Plus, Pencil, Trash2, Search, X, Brain, Layers, MousePointer2,
    Wand2, ChevronLeft, Bookmark, GraduationCap, ArrowRight, MessageSquare
} from "lucide-react";

interface QuestionManagerProps {
    words: Word[];
    units: Unit[];
}

export default function QuestionManager({ words, units }: QuestionManagerProps) {
    const [viewMode, setViewMode] = useState<"words" | "units">("words");
    const [selectedTarget, setSelectedTarget] = useState<{ id: string, name: string } | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [activeType, setActiveType] = useState<"gap-fill" | "word-meaning" | "multiple-gap">("gap-fill");
    const [searchTerm, setSearchTerm] = useState("");

    const loadQuestions = async (id: string) => {
        setIsLoading(true);
        const data = viewMode === "words"
            ? await fetchWordQuestionsAction(id)
            : await fetchUnitQuestionsAction(id);
        setQuestions(data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (selectedTarget) {
            loadQuestions(selectedTarget.id);
        }
    }, [selectedTarget, viewMode]);

    const handleSave = async (questionData: any) => {
        if (!selectedTarget) return;

        const saveAction = viewMode === "words" ? saveWordQuestionAction : saveUnitQuestionAction;
        await saveAction(selectedTarget.id, { ...questionData, id: editingQuestion?.id || "temp" });

        await loadQuestions(selectedTarget.id);
        setIsModalOpen(false);
        setEditingQuestion(null);
    };

    const handleDelete = async (questionId: string) => {
        if (!selectedTarget || !confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;

        if (viewMode === "words") {
            await deleteWordQuestionAction(selectedTarget.id, questionId);
        } else {
            await deleteUnitQuestionAction(selectedTarget.id, questionId);
        }
        await loadQuestions(selectedTarget.id);
    };

    if (!selectedTarget) {
        return (
            <div className="space-y-6">
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                    <button
                        onClick={() => setViewMode("words")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "words" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Kelime Soruları
                    </button>
                    <button
                        onClick={() => setViewMode("units")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "units" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Ünite Değerlendirme
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(viewMode === "words" ? words : units).map((item: any) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedTarget({ id: item.id, name: item.word || item.title })}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                        {item.word || item.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {viewMode === "words" ? item.definition_tr : `Ünite ${item.order}`}
                                    </p>
                                </div>
                                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSelectedTarget(null)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6 text-gray-600" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">
                                {viewMode === "words" ? "Kelime Soruları" : "Ünite Sonu Sınavı"}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">{selectedTarget.name}</h3>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setEditingQuestion(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                    <Plus className="h-4 w-4" />
                    Soru Ekle
                </button>
            </div>

            {/* Questions List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500 font-medium">Sorular yükleniyor...</p>
                </div>
            ) : questions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-gray-300" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Henüz soru eklenmemiş</h4>
                    <p className="text-gray-500 max-w-xs mx-auto mt-1">Bu {viewMode === "words" ? "kelime" : "ünite"} için ilk soruyu ekleyerek başlayın.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {questions.map((q) => (
                        <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col group relative">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${q.type === 'gap-fill' ? 'bg-blue-50 text-blue-600' :
                                    q.type === 'word-meaning' ? 'bg-purple-50 text-purple-600' :
                                        'bg-orange-50 text-orange-600'
                                    }`}>
                                    {q.type === 'gap-fill' ? 'Boşluk Doldurma' : q.type === 'word-meaning' ? 'Anlam' : 'Metin'}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => { setEditingQuestion(q); setActiveType(q.type); setIsModalOpen(true); }}
                                        className="p-1.5 rounded-lg text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(q.id)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-900 font-semibold line-clamp-3 mb-4">
                                {q.type === 'gap-fill' && q.sentence.replace('[WORD]', '____')}
                                {q.type === 'word-meaning' && `Eşleştir: ${q.word}`}
                                {q.type === 'multiple-gap' && q.text.replace(/\[GAP\d+\]/g, '____')}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal - Shared Logic */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-2xl rounded-3xl bg-white p-0 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900">
                                {editingQuestion ? "Soruyu Güncelle" : "Yeni Soru Ekle"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><X className="h-5 w-5" /></button>
                        </div>

                        {!editingQuestion && (
                            <div className="flex gap-2 p-4 bg-gray-50">
                                {[
                                    { id: 'gap-fill', label: 'Boşluk', icon: MousePointer2 },
                                    { id: 'word-meaning', label: 'Anlam', icon: Brain },
                                    { id: 'multiple-gap', label: 'Çoklu', icon: Layers }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setActiveType(t.id as any)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${activeType === t.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-600 hover:border-indigo-200'}`}
                                    >
                                        <t.icon className="h-4 w-4" />
                                        <span className="text-xs font-bold">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {activeType === 'gap-fill' && <GapFillForm onSave={handleSave} initialData={editingQuestion as GapFillQuestion} words={words} targetWord={viewMode === "words" ? selectedTarget.name : ""} />}
                            {activeType === 'word-meaning' && <WordMeaningForm onSave={handleSave} initialData={editingQuestion as WordMeaningQuestion} words={words} targetWord={viewMode === "words" ? selectedTarget.name : ""} />}
                            {activeType === 'multiple-gap' && <MultipleGapForm onSave={handleSave} initialData={editingQuestion as MultipleGapQuestion} words={words} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ---------------- SHARED FORM COMPONENTS (Modified for improved UX) ----------------

function GapFillForm({ onSave, initialData, words, targetWord }: any) {
    const [sentence, setSentence] = useState(initialData?.sentence || "");
    const [correctWord, setCorrectWord] = useState(initialData?.correctWord || targetWord || "");
    const [wrongWords, setWrongWords] = useState<string[]>(initialData?.wrongWords || ["", "", ""]);

    const generateDistractors = () => {
        const others = words.filter((w: any) => w.word !== correctWord).sort(() => Math.random() - 0.5).slice(0, 3).map((w: any) => w.word);
        setWrongWords(others);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Cümle ([WORD] etiketi boşluğu temsil eder)</label>
                <textarea
                    value={sentence}
                    onChange={e => setSentence(e.target.value)}
                    className="w-full rounded-2xl border-2 border-gray-100 p-4 focus:border-indigo-500 focus:outline-none min-h-[100px]"
                    placeholder="E.g. The sky is [WORD] today."
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Doğru Cevap</label>
                    <input value={correctWord} readOnly={!!targetWord} className="w-full rounded-xl bg-indigo-50 border-2 border-indigo-100 p-3 font-bold text-indigo-700" />
                </div>
                <div className="flex items-end">
                    <button onClick={generateDistractors} className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold flex items-center justify-center gap-2"><Wand2 className="h-4 w-4" /> Otomatik Doldur</button>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
                {wrongWords.map((w, i) => (
                    <input key={i} value={w} onChange={e => { const nw = [...wrongWords]; nw[i] = e.target.value; setWrongWords(nw); }} className="p-3 rounded-xl border-2 border-gray-50 bg-gray-50/50 text-sm focus:bg-white focus:border-indigo-500 transition-all" placeholder={`Yanlış ${i + 1}`} />
                ))}
            </div>
            <button onClick={() => onSave({ type: 'gap-fill', sentence, correctWord, wrongWords })} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all">DEĞİŞİKLİKLERİ KAYDET</button>
        </div>
    );
}

function WordMeaningForm({ onSave, initialData, words, targetWord }: any) {
    const [word, setWord] = useState(initialData?.word || targetWord || "");
    const [correctTranslation, setCorrectTranslation] = useState(initialData?.correctTranslation || "");
    const [correctDefinition, setCorrectDefinition] = useState(initialData?.correctDefinition || "");
    const [wrongChoices, setWrongChoices] = useState<string[]>(initialData?.wrongChoices || ["", "", ""]);

    useEffect(() => {
        if (targetWord && !initialData) {
            const wObj = words.find((w: any) => w.word === targetWord);
            if (wObj) {
                setCorrectTranslation(wObj.definition_tr);
                setCorrectDefinition(wObj.definition);
            }
        }
    }, [targetWord]);

    const generateDistractors = () => {
        const others = words.filter((w: any) => w.word !== word).sort(() => Math.random() - 0.5).slice(0, 3).map((w: any) => w.word);
        setWrongChoices(others);
    };

    return (
        <div className="space-y-6">
            <div className="p-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl">
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">Ana Kelime</span>
                <h4 className="text-xl font-black text-indigo-900">{word}</h4>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Doğru Çeviri</label><input value={correctTranslation} onChange={e => setCorrectTranslation(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-100" /></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-500">Tanım (EN)</label><input value={correctDefinition} onChange={e => setCorrectDefinition(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-100" /></div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between items-center"><label className="text-xs font-bold text-gray-500">Yanlış Seçenekler (Diğer Kelimeler)</label><button onClick={generateDistractors} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">OTOMATİK SEÇ</button></div>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                        {wrongChoices.map((c, i) => <input key={i} value={c} onChange={e => { const nc = [...wrongChoices]; nc[i] = e.target.value; setWrongChoices(nc); }} className="p-3 rounded-xl border-2 border-gray-100 text-sm" />)}
                    </div>
                </div>
            </div>
            <button onClick={() => onSave({ type: 'word-meaning', word, correctTranslation, correctDefinition, wrongChoices })} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all">KAYDET</button>
        </div>
    );
}

function MultipleGapForm({ onSave, initialData, words }: any) {
    const [text, setText] = useState(initialData?.text || "");
    const [gaps, setGaps] = useState(initialData?.gaps || [{ id: "GAP1", correctWord: "", wrongWords: ["", ""] }]);

    const addGap = () => setGaps([...gaps, { id: `GAP${gaps.length + 1}`, correctWord: "", wrongWords: ["", ""] }]);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Metin ve Boşluklar ([GAP1], [GAP2]...)</label>
                <textarea value={text} onChange={e => setText(e.target.value)} className="w-full rounded-2xl border-2 border-gray-100 p-4 min-h-[100px]" placeholder="She [GAP1] to the park and [GAP2] some milk." />
            </div>
            <div className="space-y-4">
                {gaps.map((g: any, i: number) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-2xl border-2 border-white shadow-sm space-y-4">
                        <div className="flex justify-between items-center"><span className="text-xs font-black text-indigo-400">{g.id}</span></div>
                        <div className="grid grid-cols-2 gap-4">
                            <input value={g.correctWord} onChange={e => { const ng = [...gaps]; ng[i].correctWord = e.target.value; setGaps(ng); }} className="p-3 rounded-xl border-2 border-white shadow-inner text-sm font-bold" placeholder="Doğru kelime" />
                            <div className="flex gap-2">
                                <input value={g.wrongWords[0]} onChange={e => { const ng = [...gaps]; ng[i].wrongWords[0] = e.target.value; setGaps(ng); }} className="flex-1 p-3 rounded-xl border-2 border-white shadow-inner text-sm" placeholder="Yanlış 1" />
                                <input value={g.wrongWords[1]} onChange={e => { const ng = [...gaps]; ng[i].wrongWords[1] = e.target.value; setGaps(ng); }} className="flex-1 p-3 rounded-xl border-2 border-white shadow-inner text-sm" placeholder="Yanlış 2" />
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={addGap} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:bg-white transiton-all">+ Boşluk Ekle</button>
            </div>
            <button onClick={() => onSave({ type: 'multiple-gap', text, gaps })} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl">KAYDET</button>
        </div>
    );
}

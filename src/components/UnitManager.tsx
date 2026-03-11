"use client";

import { useState } from "react";
import { Unit, Word } from "@/types";
import { createUnitAction, updateUnitAction, deleteUnitAction } from "@/app/actions";
import {
    Plus, ChevronRight, ChevronDown, Trash2, Edit2, ListChecks,
    GraduationCap, Search, X, Check, BookOpen
} from "lucide-react";

interface UnitManagerProps {
    initialUnits: Unit[];
    initialWords: Word[];
}

export default function UnitManager({ initialUnits, initialWords }: UnitManagerProps) {
    const [units, setUnits] = useState<Unit[]>(initialUnits);
    const [words] = useState<Word[]>(initialWords);
    const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});
    const [isAddingUnit, setIsAddingUnit] = useState(false);
    const [newUnitTitle, setNewUnitTitle] = useState("");
    const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
    const [editUnitTitle, setEditUnitTitle] = useState("");
    const [isAddingWordToUnit, setIsAddingWordToUnit] = useState<string | null>(null);
    const [wordSearch, setWordSearch] = useState("");

    const toggleUnit = (id: string) => {
        setExpandedUnits(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAddUnit = async () => {
        if (!newUnitTitle.trim()) return;
        const newUnit = await createUnitAction({
            title: newUnitTitle,
            order: units.length + 1
        });
        setUnits([...units, newUnit]);
        setNewUnitTitle("");
        setIsAddingUnit(false);
    };

    const handleDeleteUnit = async (id: string) => {
        if (!confirm("Bu üniteyi silmek istediğinize emin misiniz?")) return;
        await deleteUnitAction(id);
        setUnits(units.filter(u => u.id !== id));
    };

    const handleUpdateUnit = async (unit: Unit) => {
        if (!editUnitTitle.trim()) return;
        const updated = await updateUnitAction({ ...unit, title: editUnitTitle });
        setUnits(units.map(u => u.id === unit.id ? updated : u));
        setEditingUnitId(null);
    };

    const handleAddWordToUnit = async (unitId: string, wordId: string) => {
        const unit = units.find(u => u.id === unitId);
        if (!unit || unit.wordIds.includes(wordId)) return;

        const updatedUnit = { ...unit, wordIds: [...unit.wordIds, wordId] };
        await updateUnitAction(updatedUnit);
        setUnits(units.map(u => u.id === unitId ? updatedUnit : u));
    };

    const handleRemoveWordFromUnit = async (unitId: string, wordId: string) => {
        const unit = units.find(u => u.id === unitId);
        if (!unit) return;

        const updatedUnit = { ...unit, wordIds: unit.wordIds.filter(id => id !== wordId) };
        await updateUnitAction(updatedUnit);
        setUnits(units.map(u => u.id === unitId ? updatedUnit : u));
    };

    const getWordById = (id: string) => words.find(w => w.id === id);

    const availableWords = words.filter(w =>
        !units.some(u => u.wordIds.includes(w.id)) &&
        (w.word.toLowerCase().includes(wordSearch.toLowerCase()) ||
            w.definition_tr.toLowerCase().includes(wordSearch.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h3 className="text-2xl font-black text-gray-900">Müfredat Yapısı</h3>
                    <p className="text-sm text-gray-500 mt-1">Gelişim sırasına göre üniteleri ve kelimeleri düzenleyin.</p>
                </div>
                <button
                    onClick={() => setIsAddingUnit(true)}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                    <Plus className="h-4 w-4" />
                    Yeni Ünite
                </button>
            </div>

            {isAddingUnit && (
                <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 p-6 animate-in fade-in slide-in-from-top-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            autoFocus
                            value={newUnitTitle}
                            onChange={(e) => setNewUnitTitle(e.target.value)}
                            placeholder="Ünite Başlığı (örn: Temel Tanışma)"
                            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                        <button
                            onClick={handleAddUnit}
                            className="rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white hover:bg-indigo-700 shadow-md"
                        >
                            Oluştur
                        </button>
                        <button
                            onClick={() => setIsAddingUnit(false)}
                            className="rounded-xl bg-white border border-gray-200 px-6 py-3 font-bold text-gray-600 hover:bg-gray-50"
                        >
                            İptal
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {units.sort((a, b) => a.order - b.order).map((unit) => (
                    <div key={unit.id} className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
                        <div
                            className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${expandedUnits[unit.id] ? 'bg-indigo-50/30' : 'hover:bg-gray-50/50'}`}
                            onClick={() => toggleUnit(unit.id)}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-black transition-all ${expandedUnits[unit.id] ? 'bg-indigo-600 text-white rotate-90' : 'bg-gray-100 text-gray-400'}`}>
                                    {unit.order}
                                </div>
                                <div>
                                    {editingUnitId === unit.id ? (
                                        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                            <input
                                                autoFocus
                                                value={editUnitTitle}
                                                onChange={e => setEditUnitTitle(e.target.value)}
                                                className="rounded-lg border px-2 py-1 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <button onClick={() => handleUpdateUnit(unit)} className="text-green-600 hover:bg-green-50 p-1 rounded-lg"><Check className="h-4 w-4" /></button>
                                            <button onClick={() => setEditingUnitId(null)} className="text-gray-400 hover:bg-gray-50 p-1 rounded-lg"><X className="h-4 w-4" /></button>
                                        </div>
                                    ) : (
                                        <h4 className="text-xl font-black text-gray-900">{unit.title}</h4>
                                    )}
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="flex items-center gap-1 text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                                            <BookOpen className="h-3 w-3" />
                                            {unit.wordIds.length} Kelime
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingUnitId(unit.id);
                                        setEditUnitTitle(unit.title);
                                    }}
                                    className="p-3 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                >
                                    <Edit2 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteUnit(unit.id); }}
                                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                                {expandedUnits[unit.id] ? <ChevronDown className="h-6 w-6 text-gray-400" /> : <ChevronRight className="h-6 w-6 text-gray-400" />}
                            </div>
                        </div>

                        {expandedUnits[unit.id] && (
                            <div className="border-t border-gray-50 bg-white p-6 animate-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {unit.wordIds.map(wordId => {
                                        const word = getWordById(wordId);
                                        return (
                                            <div key={wordId} className="group flex items-center justify-between rounded-2xl bg-gray-50/50 border border-gray-100 p-4 transition-all hover:bg-white hover:border-indigo-100 hover:shadow-sm">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="h-2 w-2 rounded-full bg-indigo-600 shrink-0" />
                                                    <div className="truncate">
                                                        <div className="font-bold text-gray-900 truncate">{word?.word}</div>
                                                        <div className="text-[10px] text-gray-400 font-medium truncate uppercase">{word?.definition_tr}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveWordFromUnit(unit.id, wordId)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        );
                                    })}

                                    <button
                                        onClick={() => setIsAddingWordToUnit(unit.id)}
                                        className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 p-4 text-sm font-bold text-gray-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all active:scale-95"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Kelime Ekle
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Word Selection Modal */}
            {isAddingWordToUnit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsAddingWordToUnit(null)} />
                    <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900">Üniteye Kelime Ekle</h3>
                            <button onClick={() => setIsAddingWordToUnit(null)} className="p-2 rounded-full hover:bg-gray-100"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="p-4 bg-gray-50 border-b">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Kelime ara veya filtrele..."
                                    className="w-full bg-white rounded-xl border-none pl-10 pr-4 py-3 shadow-sm text-sm focus:ring-2 focus:ring-indigo-500"
                                    value={wordSearch}
                                    onChange={e => setWordSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
                            {availableWords.map(word => (
                                <button
                                    key={word.id}
                                    onClick={() => handleAddWordToUnit(isAddingWordToUnit, word.id)}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-indigo-50 group transition-all"
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{word.word}</div>
                                        <div className="text-xs text-gray-400 font-medium">{word.definition_tr}</div>
                                    </div>
                                    <div className="h-8 w-8 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <Plus className="h-4 w-4" />
                                    </div>
                                </button>
                            ))}
                            {availableWords.length === 0 && (
                                <div className="py-12 text-center text-gray-400 text-sm font-medium">
                                    Uygun kelime bulunamadı.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

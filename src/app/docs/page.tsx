import Link from "next/link";
import { ArrowLeft, Book, Code, Globe, Lock, Zap } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
                <div className="container mx-auto flex h-20 items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">P</div>
                            <div>
                                <h1 className="text-xl font-black tracking-tight">Parrotingo API</h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documentation v2.0</p>
                            </div>
                        </Link>
                    </div>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Dashboard'a Dön
                    </Link>
                </div>
            </header>

            <main className="container mx-auto py-16 px-6 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Sidebar Nav */}
                    <aside className="lg:col-span-3 space-y-8 hidden lg:block">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Başlangıç</h4>
                            <nav className="flex flex-col gap-2">
                                <a href="#overview" className="text-sm font-bold text-indigo-600">Genel Bakış</a>
                                <a href="#auth" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Güvenlik</a>
                            </nav>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Endpoints</h4>
                            <nav className="flex flex-col gap-2">
                                <a href="#curriculum" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Tüm Müfredat</a>
                                <a href="#units" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Üniteler</a>
                                <a href="#words" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Kelimeler</a>
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="lg:col-span-9 space-y-24">

                        {/* Section: Overview */}
                        <section id="overview" className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest">
                                <Globe className="h-3 w-3" />
                                Public API
                            </div>
                            <h2 className="text-5xl font-black tracking-tighter text-slate-900">Müfredat Veri Erişimi</h2>
                            <p className="text-xl text-slate-500 leading-relaxed">
                                Parrotingo Admin, hiyerarşik eğitim yapısını (Ünite {'>'} Kelime {'>'} Soru) JSON tabanlı bir API üzerinden sunar.
                                Bu veriler, uygulama senkronizasyonu için optimize edilmiştir.
                            </p>

                            <div className="p-8 rounded-3xl bg-slate-900 text-slate-300 space-y-4 shadow-2xl shadow-slate-200">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Base URL</h4>
                                    <Zap className="h-4 w-4 text-amber-400" />
                                </div>
                                <code className="text-lg font-mono text-indigo-400 font-bold block">
                                    /api
                                </code>
                            </div>
                        </section>

                        {/* Section: Curriculum (Sync) */}
                        <section id="curriculum" className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-emerald-100">GET</span>
                                    <h3 className="text-3xl font-black text-slate-900">/curriculum</h3>
                                </div>
                                <p className="text-slate-500">
                                    Uygulamanın çalışması için gerekli olan tüm verileri (Üniteler, Kelimeler, Kelime Soruları ve Ünite Sınavları) tek bir istekte döner.
                                    İdeal senkronizasyon endpoint'idir.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 overflow-hidden">
                                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400">
                                    <Code className="h-3 w-3" />
                                    Response Structure
                                </div>
                                <pre className="text-sm font-mono text-slate-700 bg-white p-6 rounded-2xl border border-slate-200 overflow-x-auto">
                                    {`{
  "units": [...],           // Ünite listesi (Word ID'leri ile)
  "words": [...],           // Tüm kelime tanımları
  "wordQuestions": {        // Kelime ID'sine göre gruplanmış sorular
     "word_id_1": [...],
     "word_id_2": [...]
  },
  "unitQuestions": {        // Ünite ID'sine göre gruplanmış sınavlar
     "unit_id_1": [...]
  }
}`}
                                </pre>
                            </div>
                        </section>

                        {/* Section: Units */}
                        <section id="units" className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-blue-100">GET</span>
                                    <h3 className="text-3xl font-black text-slate-900">/units</h3>
                                </div>
                                <p className="text-slate-500">Sadece ünite listesini ve o ünitelere atanmış Kelime ID'lerini getirir.</p>
                            </div>
                        </section>

                        {/* Section: Security */}
                        <section id="auth" className="p-10 rounded-[2.5rem] bg-indigo-600 text-white space-y-6 relative overflow-hidden shadow-2xl shadow-indigo-200">
                            <Lock className="absolute -right-8 -bottom-8 h-48 w-48 text-indigo-500 opacity-50" />
                            <div className="relative space-y-4">
                                <h3 className="text-3xl font-black">Güvenlik ve Performans</h3>
                                <p className="text-indigo-100 text-lg max-w-2xl">
                                    API uç noktaları şu anda **herkese açıktır**. Veriler statik JSON dosyalarından sunulduğu için yüksek performanslıdır.
                                    GitHub hızı limitlerine (Rate Limit) takılmamak için verileri istemci tarafında (Local Storage/SQLite) önbelleğe almanız önerilir.
                                </p>
                                <div className="flex gap-4 pt-4">
                                    <div className="bg-indigo-700/50 px-4 py-3 rounded-2xl border border-indigo-400/30 flex items-center gap-3">
                                        < Zap className="h-5 w-5 text-amber-300" />
                                        <div className="text-xs font-bold">Latency: ~150ms</div>
                                    </div>
                                    <div className="bg-indigo-700/50 px-4 py-3 rounded-2xl border border-indigo-400/30 flex items-center gap-3">
                                        < Book className="h-5 w-5 text-indigo-300" />
                                        <div className="text-xs font-bold">Format: JSON v2</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-100 py-12 bg-slate-50/50">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Parrotingo Educational Platform</p>
                </div>
            </footer>
        </div>
    );
}

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
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Genel Endpointler</h4>
                            <nav className="flex flex-col gap-2">
                                <a href="#summary" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Ünite Özeti</a>
                                <a href="#action" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Soru Aksiyonu</a>
                                <a href="#detail" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Kelime Soru Detayı</a>
                                <a href="#curriculum" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Tüm Müfredat</a>
                            </nav>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Ünite Değerlendirme</h4>
                            <nav className="flex flex-col gap-2">
                                <a href="#unit-questions-all" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Tüm Ünite Soruları</a>
                                <a href="#unit-questions-unit" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Üniteye Göre Sorular</a>
                                <a href="#unit-questions-detail" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Tek Soru Detayı</a>
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
                            <h2 className="text-5xl font-black tracking-tighter text-slate-900">Eğitim Veri Erişimi</h2>
                            <p className="text-xl text-slate-500 leading-relaxed">
                                Parrotingo Admin, dinamik eğitim yapısını (Ünite {'>'} Kelime {'>'} Soru) JSON tabanlı API'ler üzerinden sunar.
                                Yeni nesil endpointler, frontend'in build ve çalışma zamanı (runtime) ihtiyaçları için optimize edilmiştir.
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

                            {/* Endpoint Index */}
                            <div className="rounded-3xl border border-slate-100 overflow-hidden">
                                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Tüm Endpointler</h4>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {[
                                        { method: "GET", path: "/api/units/summary", desc: "Ünite listesi ve soru sayıları", color: "bg-indigo-600" },
                                        { method: "POST", path: "/api/questions/action", desc: "Soru index → questionId çözümleme", color: "bg-purple-600" },
                                        { method: "GET", path: "/api/words/[word]/question/[id]", desc: "Kelime sorusu detayı", color: "bg-emerald-500" },
                                        { method: "GET", path: "/api/curriculum", desc: "Tüm müfredat (toplu senkronizasyon)", color: "bg-slate-400" },
                                        { method: "GET", path: "/api/unit-questions", desc: "Tüm ünitelerin değerlendirme soruları", color: "bg-orange-500" },
                                        { method: "GET", path: "/api/unit-questions/[unitId]", desc: "Belirli bir ünitenin değerlendirme soruları", color: "bg-orange-500" },
                                        { method: "GET", path: "/api/unit-questions/[unitId]/[questionId]", desc: "Tek bir değerlendirme sorusu detayı", color: "bg-orange-500" },
                                    ].map(({ method, path, desc, color }) => (
                                        <div key={path} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                                            <span className={`shrink-0 px-2.5 py-1 ${color} text-white text-[10px] font-black rounded-md uppercase tracking-wider`}>{method}</span>
                                            <code className="text-sm font-mono text-slate-700 flex-1">{path}</code>
                                            <span className="text-xs text-slate-400 hidden md:block">{desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Section: Units Summary */}
                        <section id="summary" className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-indigo-100">GET</span>
                                    <h3 className="text-3xl font-black text-slate-900">/units/summary</h3>
                                </div>
                                <p className="text-slate-500">
                                    Frontend'in Build sırasında (veya ilk girişte) ünite listesini ve her ünitedeki toplam soru sayısını çekmesi için kullanılır.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
                                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400">
                                    <Code className="h-3 w-3" />
                                    Response Format
                                </div>
                                <pre className="text-sm font-mono text-slate-700 bg-white p-6 rounded-2xl border border-slate-200 overflow-x-auto">
                                    {`[
  {
    "ünite": 1,
    "name": "PART 1",
    "questions": 12,
    "id": "zGvs0QAlQw"
  },
  ...
]`}
                                </pre>
                            </div>
                        </section>

                        {/* Section: Question Action */}
                        <section id="action" className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-purple-600 text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-purple-100">POST</span>
                                    <h3 className="text-3xl font-black text-slate-900">/questions/action</h3>
                                </div>
                                <p className="text-slate-500">
                                    Ünite içindeki bir soru numarasına tıklandığında (Click Tipbar), o numaranın hangi kelimeye ve soruya ait olduğunu dinamik olarak belirler. Kelime soruları önce, ünite değerlendirme soruları sonra sıralanır.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="text-[10px] font-black uppercase text-slate-400 mb-2">Request Body</div>
                                    <pre className="text-xs font-mono bg-white p-4 rounded-xl border border-slate-200">
                                        {`{
  "ünite": 1,    // Ünite sırası
  "question": 5  // Tıklanan soru No
}`}
                                    </pre>
                                </div>
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="text-[10px] font-black uppercase text-slate-400 mb-2">Response</div>
                                    <pre className="text-xs font-mono bg-white p-4 rounded-xl border border-slate-200">
                                        {`{
  "word": "abandon",
  "questionId": "q_abc123",
  "type": "word"  // "word" | "unit"
}`}
                                    </pre>
                                </div>
                            </div>
                        </section>

                        {/* Section: Word Question Detail */}
                        <section id="detail" className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-emerald-100">GET</span>
                                    <h3 className="text-3xl font-black text-slate-900">/words/[word]/question/[id]</h3>
                                </div>
                                <p className="text-slate-500">
                                    Belirli bir kelimeye ait sorunun tüm detaylarını (cümle, doğru cevap, şıklar vb.) getirmek için kullanılır. <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">[id]</code> parametre olarak soru ID'si veya 1-based index kullanılabilir.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 overflow-hidden">
                                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400">
                                    <Code className="h-3 w-3" />
                                    URL Example
                                </div>
                                <code className="block text-sm font-mono text-indigo-600 bg-white p-4 rounded-xl border border-slate-200 mb-4">
                                    /api/words/abandon/question/1
                                </code>
                                <pre className="text-sm font-mono text-slate-700 bg-white p-6 rounded-2xl border border-slate-200 overflow-x-auto">
                                    {`{
  "word": "abandon",
  "question": {
    "type": "gap-fill",
    "sentence": "The baby was [WORD] by its parents.",
    "correctWord": "abandon",
    "wrongWords": ["keep", "hold", "save"],
    "id": "q123"
  }
}`}
                                </pre>
                            </div>
                        </section>

                        {/* Section: Curriculum (Legacy Sync) */}
                        <section id="curriculum" className="space-y-8 border-t border-slate-100 pt-16">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-slate-400 text-white text-[10px] font-black rounded-lg uppercase tracking-wider">GET</span>
                                    <h3 className="text-3xl font-black text-slate-900">/curriculum</h3>
                                </div>
                                <p className="text-slate-500 italic">
                                    Tüm verileri tek seferde döner. Toplu senkronizasyon için kullanılabilir.
                                </p>
                            </div>
                            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
                                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400">
                                    <Code className="h-3 w-3" />
                                    Response Format
                                </div>
                                <pre className="text-sm font-mono text-slate-700 bg-white p-6 rounded-2xl border border-slate-200 overflow-x-auto">
                                    {`{
  "units": [ ...Unit[] ],
  "words": [ ...Word[] ],
  "wordQuestions": { "wordId": [ ...Question[] ] },
  "unitQuestions": { "unitId": [ ...Question[] ] }
}`}
                                </pre>
                            </div>
                        </section>

                        {/* ================================================ */}
                        {/* UNIT EVALUATION QUESTIONS SECTION */}
                        {/* ================================================ */}
                        <div className="border-t-4 border-orange-100 pt-16 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-black uppercase tracking-widest">
                                <Book className="h-3 w-3" />
                                Ünite Değerlendirme Soruları
                            </div>
                            <p className="text-slate-500 text-lg">
                                Her ünitenin sonundaki değerlendirme sorularına doğrudan erişim sağlayan endpointler. Kelime sorularından bağımsız, ünite bazlı sorgulama yapılabilir.
                            </p>

                            {/* Question Types Reference */}
                            <div className="rounded-3xl border border-orange-100 bg-orange-50/40 p-6 space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-orange-500">Soru Tipleri</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[
                                        { type: "gap-fill", desc: "Tek boşluklu cümle tamamlama", fields: "sentence, correctWord, wrongWords[]" },
                                        { type: "multiple-gap", desc: "Çok boşluklu metin tamamlama", fields: "text, gaps[{ id, correctWord, wrongWords[] }]" },
                                        { type: "word-meaning", desc: "Kelime anlam eşleştirme", fields: "word, correctTranslation, correctDefinition, wrongChoices[]" },
                                    ].map(({ type, desc, fields }) => (
                                        <div key={type} className="bg-white rounded-2xl border border-orange-100 p-4 space-y-2">
                                            <code className="text-xs font-mono font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-md">{type}</code>
                                            <p className="text-xs text-slate-500">{desc}</p>
                                            <p className="text-[10px] font-mono text-slate-400">{fields}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section: GET /unit-questions */}
                        <section id="unit-questions-all" className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-orange-100">GET</span>
                                    <h3 className="text-3xl font-black text-slate-900">/unit-questions</h3>
                                </div>
                                <p className="text-slate-500">
                                    Tüm ünitelerin değerlendirme sorularını, ünite metadata'sı ile birlikte döner. Ünite sırasına göre sıralıdır.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 space-y-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <Code className="h-3 w-3" />
                                    Response Format
                                </div>
                                <pre className="text-sm font-mono text-slate-700 bg-white p-6 rounded-2xl border border-slate-200 overflow-x-auto">
                                    {`[
  {
    "unitId": "zGvs0QAlQw",
    "unitTitle": "PART 1",
    "unitOrder": 1,
    "questionCount": 10,
    "questions": [
      {
        "id": "abc123",
        "type": "gap-fill",
        "sentence": "The sailors had to [WORD] the sinking ship.",
        "correctWord": "abandon",
        "wrongWords": ["rescue", "board", "repair"]
      },
      {
        "id": "def456",
        "type": "word-meaning",
        "word": "destiny",
        "correctTranslation": "kader",
        "correctDefinition": "The events that will happen to someone in the future.",
        "wrongChoices": ["şans", "başarı", "fırsat"]
      },
      ...
    ]
  },
  {
    "unitId": "unit-1",
    "unitTitle": "PART 2",
    "unitOrder": 2,
    "questionCount": 10,
    "questions": [ ... ]
  }
]`}
                                </pre>
                            </div>
                        </section>

                        {/* Section: GET /unit-questions/[unitId] */}
                        <section id="unit-questions-unit" className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-orange-100">GET</span>
                                    <h3 className="text-3xl font-black text-slate-900">/unit-questions/[unitId]</h3>
                                </div>
                                <p className="text-slate-500">
                                    Belirli bir ünitenin değerlendirme sorularını döner. Opsiyonel <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">?type=</code> query parametresi ile soru tipi filtrelenebilir.
                                </p>
                            </div>

                            {/* URL + Query Params */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <Code className="h-3 w-3" />
                                    URL & Query Params
                                </div>
                                <div className="bg-slate-900 rounded-2xl p-5 space-y-3 font-mono text-sm">
                                    <div>
                                        <span className="text-slate-500"># Tüm sorular</span>
                                        <div className="text-indigo-400 mt-1">GET /api/unit-questions/zGvs0QAlQw</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500"># Sadece gap-fill soruları</span>
                                        <div className="text-indigo-400 mt-1">GET /api/unit-questions/zGvs0QAlQw?type=gap-fill</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500"># Sadece word-meaning soruları</span>
                                        <div className="text-indigo-400 mt-1">GET /api/unit-questions/zGvs0QAlQw?type=word-meaning</div>
                                    </div>
                                    <div>
                                        <span className="text-slate-500"># Sadece multiple-gap soruları</span>
                                        <div className="text-indigo-400 mt-1">GET /api/unit-questions/zGvs0QAlQw?type=multiple-gap</div>
                                    </div>
                                </div>
                            </div>

                            {/* Query Params Table */}
                            <div className="rounded-2xl border border-slate-100 overflow-hidden">
                                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Query Parameters
                                </div>
                                <div className="divide-y divide-slate-100">
                                    <div className="grid grid-cols-4 px-5 py-3 gap-4 text-xs">
                                        <span className="font-black text-slate-700 font-mono">type</span>
                                        <span className="text-slate-400">opsiyonel</span>
                                        <span className="font-mono text-slate-500 col-span-2">
                                            <code className="bg-slate-100 px-1 rounded">gap-fill</code>{" | "}
                                            <code className="bg-slate-100 px-1 rounded">word-meaning</code>{" | "}
                                            <code className="bg-slate-100 px-1 rounded">multiple-gap</code>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="text-[10px] font-black uppercase text-slate-400 mb-2">Response (200 OK)</div>
                                    <pre className="text-xs font-mono bg-white p-4 rounded-xl border border-slate-200 overflow-x-auto">
                                        {`{
  "unitId": "zGvs0QAlQw",
  "unitTitle": "PART 1",
  "unitOrder": 1,
  "questionCount": 10,
  "questions": [ ...Question[] ]
}`}
                                    </pre>
                                </div>
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="text-[10px] font-black uppercase text-slate-400 mb-2">Error (404)</div>
                                    <pre className="text-xs font-mono bg-white p-4 rounded-xl border border-slate-200">
                                        {`{
  "error": "Unit not found"
}`}
                                    </pre>
                                </div>
                            </div>

                            {/* All 3 Question Type Responses */}
                            <div className="space-y-4">
                                <div className="text-xs font-black uppercase tracking-widest text-slate-400">Soru Tipi Örnekleri (questions array içinde)</div>

                                <div className="space-y-3">
                                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                                        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                                            <code className="text-xs font-mono font-black text-orange-600">gap-fill</code>
                                        </div>
                                        <pre className="text-xs font-mono text-slate-700 p-4 bg-white overflow-x-auto">
                                            {`{
  "id": "abc123",
  "type": "gap-fill",
  "sentence": "The sailors had to [WORD] the sinking ship.",
  "correctWord": "abandon",
  "wrongWords": ["rescue", "board", "repair"]
}`}
                                        </pre>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                                        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                                            <code className="text-xs font-mono font-black text-orange-600">multiple-gap</code>
                                        </div>
                                        <pre className="text-xs font-mono text-slate-700 p-4 bg-white overflow-x-auto">
                                            {`{
  "id": "def456",
  "type": "multiple-gap",
  "text": "The bridge began to [GAP1] after the flood and [GAP2] into the river.",
  "gaps": [
    {
      "id": "GAP1",
      "correctWord": "collapse",
      "wrongWords": ["float", "rebuild"]
    },
    {
      "id": "GAP2",
      "correctWord": "fall",
      "wrongWords": ["rise", "swim"]
    }
  ]
}`}
                                        </pre>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                                        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                                            <code className="text-xs font-mono font-black text-orange-600">word-meaning</code>
                                        </div>
                                        <pre className="text-xs font-mono text-slate-700 p-4 bg-white overflow-x-auto">
                                            {`{
  "id": "ghi789",
  "type": "word-meaning",
  "word": "destiny",
  "correctTranslation": "kader",
  "correctDefinition": "The events that will happen to someone in the future.",
  "wrongChoices": ["şans", "başarı", "fırsat"]
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: GET /unit-questions/[unitId]/[questionId] */}
                        <section id="unit-questions-detail" className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-orange-100">GET</span>
                                    <h3 className="text-3xl font-black text-slate-900">/unit-questions/[unitId]/[questionId]</h3>
                                </div>
                                <p className="text-slate-500">
                                    Belirli bir ünitenin, belirli bir değerlendirme sorusunu detaylı şekilde döner. Soru-soru ilerleme yapan uygulamalar için uygundur.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <Code className="h-3 w-3" />
                                    URL Example
                                </div>
                                <code className="block text-sm font-mono text-indigo-600 bg-slate-900 p-5 rounded-2xl">
                                    GET /api/unit-questions/zGvs0QAlQw/abc123
                                </code>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="text-[10px] font-black uppercase text-slate-400 mb-2">Response (200 OK)</div>
                                    <pre className="text-xs font-mono bg-white p-4 rounded-xl border border-slate-200 overflow-x-auto">
                                        {`{
  "unitId": "zGvs0QAlQw",
  "unitTitle": "PART 1",
  "unitOrder": 1,
  "question": {
    "id": "abc123",
    "type": "gap-fill",
    "sentence": "The sailors had to [WORD]...",
    "correctWord": "abandon",
    "wrongWords": ["rescue", "board", "repair"]
  }
}`}
                                    </pre>
                                </div>
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                                    <div className="text-[10px] font-black uppercase text-slate-400">Error Cases</div>
                                    <div>
                                        <div className="text-[10px] text-slate-400 mb-1">Unit bulunamadı (404)</div>
                                        <pre className="text-xs font-mono bg-white p-3 rounded-xl border border-slate-200">
                                            {`{ "error": "Unit not found" }`}
                                        </pre>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-400 mb-1">Soru bulunamadı (404)</div>
                                        <pre className="text-xs font-mono bg-white p-3 rounded-xl border border-slate-200">
                                            {`{ "error": "Question not found" }`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: Security */}
                        <section id="auth" className="p-10 rounded-[2.5rem] bg-indigo-600 text-white space-y-6 relative overflow-hidden shadow-2xl shadow-indigo-200">
                            <Lock className="absolute -right-8 -bottom-8 h-48 w-48 text-indigo-500 opacity-50" />
                            <div className="relative space-y-4">
                                <h3 className="text-3xl font-black">Güvenlik ve Performans</h3>
                                <p className="text-indigo-100 text-lg max-w-2xl">
                                    API uç noktaları şu anda herkese açıktır. Veriler hem yerel dosya sisteminden (Local) hem de GitHub API (Remote) üzerinden çift yönlü senkronize edilmektedir.
                                </p>
                                <div className="flex gap-4 pt-4">
                                    <div className="bg-indigo-700/50 px-4 py-3 rounded-2xl border border-indigo-400/30 flex items-center gap-3">
                                        <Zap className="h-5 w-5 text-amber-300" />
                                        <div className="text-xs font-bold">Latency: ~50ms (Local)</div>
                                    </div>
                                    <div className="bg-indigo-700/50 px-4 py-3 rounded-2xl border border-indigo-400/30 flex items-center gap-3">
                                        <Globe className="h-5 w-5 text-indigo-300" />
                                        <div className="text-xs font-bold">Storage: GitHub Sync</div>
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

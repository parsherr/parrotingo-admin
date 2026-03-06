import Link from "next/link";

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">P</div>
                            <h1 className="text-xl font-bold text-gray-900">Parrotingo API Docs</h1>
                        </Link>
                    </div>
                    <div>
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            ← Dashboard'a Dön
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="space-y-12">
                    {/* Giriş */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-gray-900">API Kullanımı</h2>
                        <p className="text-lg text-gray-600">
                            Parrotingo sözlük verilerine dış uygulamalardan erişmek için aşağıdaki uç noktaları (endpoints) kullanabilirsiniz.
                            Veriler gerçek zamanlı olarak GitHub üzerindeki JSON dosyasından çekilmektedir.
                        </p>
                    </div>

                    {/* Temel URL */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Temel URL</h3>
                        <code className="block bg-gray-100 p-3 rounded-lg text-indigo-700 font-mono text-sm">
                            {process.env.NEXT_PUBLIC_APP_URL || 'https://parrotingo-admin.vercel.app'}/api
                        </code>
                    </div>

                    {/* Endpoint 1: Tüm Kelimeler */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">GET</span>
                            <h3 className="text-xl font-bold text-gray-900">/words</h3>
                        </div>
                        <p className="text-gray-600">Sözlükteki tüm kelimeleri ve detaylarını içeren bir liste döner.</p>

                        <div className="bg-slate-900 rounded-xl p-6 text-slate-100 font-mono text-sm overflow-x-auto">
                            <h4 className="text-slate-400 mb-4 font-sans uppercase tracking-wider text-xs">Örnek Yanıt:</h4>
                            <pre>{`[`}
                                {`  {`}
                                {`    "id": "550e8400-e29b-41d4-a716-446655440000",`}
                                {`    "word": "Apple",`}
                                {`    "translation": "Elma",`}
                                {`    "example": "I like to eat apples.",`}
                                {`    "category": "Fruit"`}
                                {`  },`}
                                {`  ...`}
                                {`]`}</pre>
                        </div>
                    </div>

                    {/* Endpoint 2: Tek Kelime */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">GET</span>
                            <h3 className="text-xl font-bold text-gray-900">/words/[word]</h3>
                        </div>
                        <p className="text-gray-600">Belirli bir kelimenin detaylarını getirir. Kelime arama büyük/küçük harf duyarsızdır.</p>

                        <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-indigo-500">
                            <p className="text-sm text-gray-700 font-mono">
                                <span className="text-gray-500">Örnek İstek:</span> /api/words/apple
                            </p>
                        </div>

                        <div className="bg-slate-900 rounded-xl p-6 text-slate-100 font-mono text-sm overflow-x-auto">
                            <h4 className="text-slate-400 mb-4 font-sans uppercase tracking-wider text-xs">Örnek Yanıt:</h4>
                            <pre>{`{`}
                                {`  "id": "550e8400-e29b-41d4-a716-446655440000",`}
                                {`  "word": "Apple",`}
                                {`  "translation": "Elma",`}
                                {`  "example": "I like to eat apples.",`}
                                {`  "category": "Fruit"`}
                                {`}`}</pre>
                        </div>
                    </div>

                    {/* Önemli Not */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
                        <div className="text-amber-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-amber-900">Önemli Not</h4>
                            <p className="text-amber-800 text-sm mt-1">
                                API uç noktaları şu anda herkese açıktır (Public). Dashboard şifresinden bağımsız olarak çalışırlar.
                                Mobil uygulama veya frontend sitenizden doğrudan bu URL'lere istek atabilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

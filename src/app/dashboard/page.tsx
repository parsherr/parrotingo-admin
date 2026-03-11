import {
    fetchWordsAction,
    fetchUnitsAction
} from "@/app/actions";
import WordList from "@/components/WordList";
import QuestionManager from "@/components/QuestionManager";
import UnitManager from "@/components/UnitManager";
import { logoutAction } from "@/app/actions";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Code } from "lucide-react";

export default async function DashboardPage() {
    if (!(await isAuthenticated())) {
        redirect("/admin");
    }

    const words = await fetchWordsAction();
    const units = await fetchUnitsAction();

    return (
        <div className="min-h-screen bg-gray-50/50 text-gray-900">
            <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">P</div>
                            <h1 className="text-xl font-bold text-gray-900">Parrotingo Admin</h1>
                        </div>
                        <nav className="hidden md:flex items-center gap-1">
                            <Link
                                href="/docs"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            >
                                <Code className="h-4 w-4" />
                                API Dökümanları
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-500 hidden sm:inline-block">Admin Panel</span>
                        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
                        <form action={logoutAction}>
                            <button type="submit" className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors">
                                Çıkış Yap
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Tabs defaultValue="units" className="w-full">
                    <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight">Eğitim Yönetimi</h2>
                            <p className="text-gray-500 mt-1">Üniteleri, kelimeleri ve soruları hiyerarşik olarak düzenleyin.</p>
                        </div>
                        <TabsList className="bg-gray-100 p-1 rounded-xl">
                            <TabsTrigger value="units" className="rounded-lg px-6">Üniteler</TabsTrigger>
                            <TabsTrigger value="words" className="rounded-lg px-6">Tüm Kelimeler</TabsTrigger>
                            <TabsTrigger value="questions" className="rounded-lg px-6">Soru Bazlı</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="units" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <UnitManager initialUnits={units} initialWords={words} />
                    </TabsContent>

                    <TabsContent value="words" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <WordList initialWords={words} />
                    </TabsContent>

                    <TabsContent value="questions" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <QuestionManager words={words} units={units} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

import { fetchWordsAction } from "@/app/actions";
import WordList from "@/components/WordList";
import { logoutAction } from "@/app/actions";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    if (!(await isAuthenticated())) {
        redirect("/login");
    }

    const words = await fetchWordsAction();

    return (
        <div className="min-h-screen bg-gray-50/50">
            <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">P</div>
                            <h1 className="text-xl font-bold text-gray-900">Parrotingo Admin</h1>
                        </div>
                        <nav className="hidden md:flex items-center gap-4">
                            <a href="/docs" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                                API Dokümanları
                            </a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:inline-block">Hoş geldiniz, Admin</span>
                        <form action={logoutAction}>
                            <button type="submit" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
                                Çıkış Yap
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Sözlük Yönetimi</h2>
                        <p className="text-gray-500">Kelimeleri ekleyin, düzenleyin veya silin.</p>
                    </div>
                </div>

                <WordList initialWords={words} />
            </main>
        </div>
    );
}

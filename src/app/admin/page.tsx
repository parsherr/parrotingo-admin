"use client";

import { useState } from "react";
import { loginAction } from "@/app/actions";

export default function LoginPage() {
    const [error, setError] = useState("");

    async function handleSubmit(formData: FormData) {
        const result = await loginAction(formData);
        if (result && result.error) {
            setError(result.error);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg border border-gray-100">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Girişi</h1>
                    <p className="mt-2 text-sm text-gray-600">Sözlük yönetimi için şifrenizi girin</p>
                </div>
                <form className="mt-8 space-y-6" action={handleSubmit}>
                    <div>
                        <label htmlFor="password" title="Password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="relative block w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Admin Şifresi"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                    <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 py-3 px-4 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
}

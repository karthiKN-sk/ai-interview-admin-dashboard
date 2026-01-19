import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function LoginPage() {
    const login = useAuthStore((s) => s.login);
    const loading = useAuthStore((s) => s.loading);
    const error = useAuthStore((s) => s.error);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

                {/* LEFT – LOGIN FORM */}
                <div className="p-10">
                    <h1 className="text-3xl font-bold mb-2">
                        Login <span className="text-blue-600">✌️</span>
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Welcome back! Please login to your account.
                    </p>

                    {error && (
                        <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm text-gray-600">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* <div className="text-right text-sm">
                            <a href="#" className="text-purple-600 hover:underline">
                                Forgot Password?
                            </a>
                        </div> */}

                        <button
                            disabled={loading}
                            className="w-full mt-5 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="text-xs text-gray-400 mt-8">
                        © 2025 Grootan. All rights reserved.
                    </p>
                </div>

                {/* RIGHT – HERO SECTION */}
                <div className="hidden md:flex items-center justify-center bg-linear-to-br from-blue-600 to-indigo-600 relative">
                    <div className="text-white text-center px-10">
                        <h2 className="text-3xl font-bold mb-4">
                            Powering Smarter Interviews with AI ✨
                        </h2>
                        <p className="text-purple-100 text-lg">
                            Manage interviews, evaluate candidates intelligently, and gain deep insights —
                            all from one powerful admin dashboard.
                        </p>
                    </div>

                    {/* Decorative waves */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,white,transparent)]" />
                </div>
            </div>
        </div>
    );
}

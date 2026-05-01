import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Eye, EyeOff, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate("/dashboard");
      return;
    }

    setError(result.error || "Invalid credentials. Try again.");
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white" style={{ fontSize: "22px", fontWeight: 700 }}>
              SkillSwap
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-white mb-4" style={{ fontSize: "36px", fontWeight: 700, lineHeight: "1.2" }}>
              Exchange skills,
              <br />
              not money.
            </h2>
            <p className="text-indigo-200" style={{ fontSize: "16px", lineHeight: "1.6" }}>
              Connect with talented people, share what you know, and learn what you need - completely free.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "12K+", label: "Members" },
              { value: "48K+", label: "Skills" },
              { value: "95%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-white" style={{ fontSize: "20px", fontWeight: 700 }}>
                  {stat.value}
                </p>
                <p className="text-indigo-200" style={{ fontSize: "11px" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
            <p className="text-white/90 italic mb-3" style={{ fontSize: "14px" }}>
              "I traded React lessons for UX design sessions. Best learning experience I've ever had!"
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1643816831186-b2427a8f9f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100"
                alt="User"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
              />
              <div>
                <p className="text-white" style={{ fontSize: "13px", fontWeight: 600 }}>
                  Sophia Chen
                </p>
                <p className="text-indigo-300" style={{ fontSize: "11px" }}>
                  UI/UX Designer
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-indigo-300" style={{ fontSize: "12px" }}>
            (c) 2026 SkillSwap | Exchange & Grow
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-900" style={{ fontSize: "20px", fontWeight: 700 }}>
              SkillSwap
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-slate-900 mb-2" style={{ fontSize: "28px", fontWeight: 700 }}>
              Welcome back
            </h1>
            <p className="text-slate-500" style={{ fontSize: "15px" }}>
              Sign in to continue swapping skills.
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 mb-6">
            <p className="text-indigo-700 mb-1" style={{ fontSize: "12px", fontWeight: 600 }}>
              Want a quick look around?
            </p>
            <p className="text-indigo-900" style={{ fontSize: "13px", lineHeight: "1.5" }}>
              Use the demo account: <strong>sophia@example.com</strong> / <strong>DemoPass123!</strong>
            </p>
          </div>

          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 text-slate-500 bg-slate-50 transition-all mb-6 disabled:opacity-80 disabled:cursor-not-allowed"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google sign-in coming soon
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400" style={{ fontSize: "12px" }}>
              or sign in with email
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600" style={{ fontSize: "13px" }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-slate-700 mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                style={{ fontSize: "14px" }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-700" style={{ fontSize: "13px", fontWeight: 500 }}>
                  Password
                </label>
                <button type="button" className="text-indigo-600 hover:text-indigo-700" style={{ fontSize: "12px" }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12"
                  style={{ fontSize: "14px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md hover:shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ fontSize: "15px", fontWeight: 600 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 mt-6" style={{ fontSize: "14px" }}>
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700" style={{ fontWeight: 600 }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

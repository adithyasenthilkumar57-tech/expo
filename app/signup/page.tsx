"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Bot, Mail, Lock, User, Building2, ArrowRight, Check, Eye, EyeOff } from "lucide-react";

const benefits = [
  "AI qualifies leads in under 2 minutes",
  "Auto invoice follow-ups",
  "Appointment reminder automation",
  "Embeddable website widget",
  "No credit card required",
];

export default function SignupPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !business) { setError("Please fill in all fields."); return; }
    setError("");
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");

    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex relative">
      <div className="mesh-bg" />
      <div className="grid-overlay" />

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[440px] p-12 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Bot className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-white leading-none">OpsAgent</p>
            <p className="text-[10px] text-slate-500">by CRESCONIX</p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black text-white mb-6 leading-tight">
            Your AI employee,<br />
            <span className="gradient-text">starting today.</span>
          </h2>
          <div className="flex flex-col gap-3">
            {benefits.map(b => (
              <div key={b} className="flex items-center gap-3 text-sm text-slate-400">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                {b}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-700">© 2026 CRESCONIX, Inc.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-white">OpsAgent</span>
          </div>

          <div className="glass-card p-8">
            {/* Progress */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 1 ? "bg-blue-600 text-white" : "bg-white/10 text-slate-500"}`}>
                  {step > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
                </div>
                <span className={step >= 1 ? "text-slate-300 font-medium" : "text-slate-600"}>Business</span>
              </div>
              <div className="flex-1 h-[1px] bg-white/10" />
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 2 ? "bg-blue-600 text-white" : "bg-white/10 text-slate-500"}`}>2</div>
                <span className={step >= 2 ? "text-slate-300 font-medium" : "text-slate-600"}>Account</span>
              </div>
            </div>

            {step === 1 ? (
              <form onSubmit={handleStep1}>
                <h1 className="text-xl font-bold text-white mb-1">Tell us about your business</h1>
                <p className="text-sm text-slate-500 mb-6">We&apos;ll configure OpsAgent to match your needs</p>

                <div className="flex flex-col gap-4">
                  <Input
                    label="Your full name"
                    placeholder="Alex Mercer"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    leftElement={<User className="w-4 h-4" />}
                    id="signup-name"
                  />
                  <Input
                    label="Business name"
                    placeholder="Apex Consulting"
                    value={business}
                    onChange={e => setBusiness(e.target.value)}
                    leftElement={<Building2 className="w-4 h-4" />}
                    id="signup-business"
                  />
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-1.5 block">Industry</label>
                    <select className="input-field text-sm" id="signup-industry">
                      <option value="">Select your industry…</option>
                      <option>Consulting</option>
                      <option>Retail</option>
                      <option>Healthcare</option>
                      <option>Legal Services</option>
                      <option>Real Estate</option>
                      <option>Home Services</option>
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <Button type="submit" variant="primary" size="lg" className="w-full mt-2" rightIcon={<ArrowRight className="w-4 h-4" />} id="signup-next">
                    Continue
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleStep2}>
                <h1 className="text-xl font-bold text-white mb-1">Create your account</h1>
                <p className="text-sm text-slate-500 mb-6">Setting up OpsAgent for <strong className="text-slate-300">{business}</strong></p>

                <div className="flex flex-col gap-4">
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    leftElement={<Mail className="w-4 h-4" />}
                    id="signup-email"
                  />
                  <Input
                    label="Password"
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    leftElement={<Lock className="w-4 h-4" />}
                    rightElement={
                      <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-500 hover:text-slate-300">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    id="signup-password"
                  />

                  {/* Password strength */}
                  {password && (
                    <div>
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`flex-1 h-1 rounded-full ${password.length >= i * 3 ? i <= 1 ? "bg-red-400" : i <= 2 ? "bg-amber-400" : i <= 3 ? "bg-blue-400" : "bg-emerald-400" : "bg-white/10"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600">{password.length < 4 ? "Too weak" : password.length < 7 ? "Could be stronger" : password.length < 10 ? "Good" : "Strong!"}</p>
                    </div>
                  )}

                  <label className="flex items-start gap-2 text-sm text-slate-500 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 accent-blue-500" required />
                    <span>I agree to the <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a></span>
                  </label>

                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />} id="signup-submit">
                    {isLoading ? "Creating account…" : "Create Account — Free"}
                  </Button>

                  <button type="button" onClick={() => setStep(1)} className="text-sm text-slate-600 hover:text-slate-400 transition-colors text-center">← Back</button>
                </div>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

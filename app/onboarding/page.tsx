"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare, CheckCircle, ArrowRight, Sparkles,
  Scissors, Activity, Dumbbell, Store, ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";

const BUSINESS_TYPES = [
  {
    id: "salon",
    label: "Salon / Barbershop",
    icon: Scissors,
    emoji: "✂️",
    desc: "Hair, beard, facial treatments",
    services: "Haircut ₹200 • Beard ₹80 • Facial ₹500",
    tone: "Friendly Hinglish",
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/30",
  },
  {
    id: "clinic",
    label: "Clinic / Hospital",
    icon: Activity,
    emoji: "🏥",
    desc: "Medical consultations & tests",
    services: "Consultation ₹300 • Follow-up ₹150",
    tone: "Professional English",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/30",
  },
  {
    id: "gym",
    label: "Gym / Fitness Studio",
    icon: Dumbbell,
    emoji: "💪",
    desc: "Memberships & personal training",
    services: "Trial Free • Monthly ₹1,200",
    tone: "Energetic",
    color: "from-orange-500/20 to-amber-500/10",
    border: "border-orange-500/30",
  },
  {
    id: "other",
    label: "Other Business",
    icon: Store,
    emoji: "🏪",
    desc: "Restaurant, spa, boutique, etc.",
    services: "Custom services",
    tone: "Friendly",
    color: "from-purple-500/20 to-violet-500/10",
    border: "border-purple-500/30",
  },
];

const STEPS = [
  { label: "Business Info", desc: "Name & type" },
  { label: "Contact Details", desc: "Phone & location" },
  { label: "Go Live!", desc: "Connect WhatsApp" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    phone: "",
    city: "",
    address: "",
  });

  const selectedType = BUSINESS_TYPES.find((t) => t.id === form.businessType);

  const handleStep1Next = () => {
    if (!form.businessName.trim()) return toast.error("Please enter your business name!");
    if (!form.businessType) return toast.error("Please select a business type!");
    setStep(2);
  };

  const handleStep2Next = async () => {
    if (!form.phone.trim()) return toast.error("Please enter your WhatsApp number!");
    setLoading(true);
    try {
      // In real app: call /api/onboarding; here we simulate
      await new Promise((r) => setTimeout(r, 1500));
      toast.success(`${form.businessName} is ready! 🎉`);
      setStep(3);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between glass">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[--brand-gold]/10 border border-[--brand-gold]/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[--brand-gold]" />
          </div>
          <span className="font-bold font-display text-[--brand-gold] text-lg">LocalSuite</span>
        </Link>
        <div className="text-xs text-[--muted] font-bold uppercase tracking-widest">Setup Phase • {step}/3</div>
      </nav>

      <div className="flex-1 flex">
        {/* Left: Steps sidebar */}
        <div className="hidden lg:flex flex-col w-72 p-8 border-r border-white/5">
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-1">30-second setup</h2>
            <p className="text-sm text-gray-400">Your bot will be live instantly.</p>
          </div>
          <div className="space-y-4">
            {STEPS.map((s, i) => {
              const num = i + 1;
              const done = step > num;
              const active = step === num;
              return (
                <div key={s.label} className="flex items-start gap-4">
                  <div className={`step-number mt-0.5 ${done ? "step-number-done bg-[--brand-gold] text-[--midnight]" : active ? "step-number-active border-[--brand-gold] text-[--brand-gold]" : "step-number-pending"}`}>
                    {done ? <CheckCircle className="w-4 h-4" /> : num}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${active ? "text-[--brand-gold]" : done ? "text-[--foreground]" : "text-[--muted]"}`}>{s.label}</div>
                    <div className="text-[10px] text-[--muted] uppercase tracking-wide font-medium">{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Preview card */}
          {form.businessType && (
            <div className="mt-auto card animate-slide-in border border-[--brand-gold]/20" style={{ background: "rgba(212,175,55,0.05)" }}>
              <div className="text-[10px] text-[--brand-gold] font-bold uppercase tracking-widest mb-2">Auto-Configuring ✨</div>
              <div className="text-sm font-bold text-[--foreground]">{form.businessName || "Your Venture"}</div>
              <div className="text-xs text-[--muted] mt-1 italic">{selectedType?.services}</div>
              <div className="text-[10px] text-[--brand-gold] mt-2 font-bold uppercase">Persona: {selectedType?.tone}</div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-start justify-center p-8 pt-12">
          <div className="w-full max-w-xl">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-8 animate-slide-in">
                <div>
                  <h1 className="text-4xl font-bold font-display text-[--foreground]">Define your venture</h1>
                  <p className="text-[--muted] mt-2 text-lg">Let's craft your premium AI presence in seconds.</p>
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-xs font-bold text-[--brand-gold] uppercase tracking-widest mb-2">Business Name *</label>
                  <input
                    id="business-name"
                    className="input-field text-lg py-4"
                    placeholder="e.g. Glamour Studios, Radiant Health Clinic"
                    value={form.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStep1Next()}
                  />
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Business type *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {BUSINESS_TYPES.map((type) => (
                      <button
                        key={type.id}
                        id={`type-${type.id}`}
                        onClick={() => update("businessType", type.id)}
                        className={`rounded-2xl p-5 text-left border transition-all duration-300 bg-[--surface-3] ${
                          form.businessType === type.id
                            ? `border-[--brand-gold] ring-4 ring-[--brand-gold]/10 scale-[1.02] shadow-2xl shadow-[--brand-gold]/5`
                            : "border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="text-3xl mb-3">{type.emoji}</div>
                        <div className={`font-bold text-sm ${form.businessType === type.id ? "text-[--brand-gold]" : "text-[--foreground]"}`}>{type.label}</div>
                        <div className="text-[10px] text-[--muted] mt-1 leading-relaxed">{type.desc}</div>
                        {form.businessType === type.id && (
                          <div className="mt-3 text-[10px] font-bold text-[--brand-gold] uppercase tracking-wider">
                            ✓ AI Persona Primed
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Magic preview */}
                {form.businessType && (
                  <div className="rounded-2xl p-5 border border-[--brand-gold]/20 animate-slide-in" style={{ background: "rgba(212,175,55,0.05)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-[--brand-gold]" />
                      <span className="text-sm font-bold text-[--brand-gold] uppercase tracking-widest">Premium Intelligence Active:</span>
                    </div>
                    <div className="text-sm text-[--muted] space-y-2">
                      <div className="flex items-center gap-2">✅ Services pre-loaded: <span className="text-[--foreground] font-semibold">{selectedType?.services}</span></div>
                      <div className="flex items-center gap-2">✅ Persona established: <span className="text-[--foreground] font-semibold">{selectedType?.tone}</span></div>
                      <div className="flex items-center gap-2">✅ Multilingual Support (Hindi + English) enabled</div>
                    </div>
                  </div>
                )}

                 <button id="step1-next" onClick={handleStep1Next} className="btn-primary w-full justify-center py-4 text-lg">
                  Continue to Connectivity
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <h1 className="text-3xl font-bold">Contact details</h1>
                  <p className="text-gray-400 mt-2">The WhatsApp number where your bot will reply.</p>
                </div>

                {/* Google Sign-In Integration */}
                <div className="space-y-4">
                  <button 
                    onClick={() => toast.success("Redirecting to Google...")}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-medium text-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px flex-1 bg-white/5"></div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">or use phone number</span>
                    <div className="h-px flex-1 bg-white/5"></div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">+91</span>
                        <input
                          id="phone-input"
                          className="input-field pl-12"
                          placeholder="9876543210"
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          type="tel"
                          maxLength={10}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">This must be your WhatsApp Business number</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                      <input
                        id="city-input"
                        className="input-field"
                        placeholder="e.g. Mumbai, Delhi, Bangalore"
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Address <span className="text-gray-500">(optional)</span></label>
                      <textarea
                        id="address-input"
                        className="input-field resize-none"
                        rows={2}
                        placeholder="Shop no., Street, Area, City"
                        value={form.address}
                        onChange={(e) => update("address", e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">The bot will share this address with your customers</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center py-3">
                      Back
                    </button>
                    <button
                      id="step2-next"
                      onClick={handleStep2Next}
                      disabled={loading}
                      className="btn-primary flex-[2] justify-center py-3 text-base"
                    >
                      {loading ? (
                        <>Activating Intelligence... <span className="animate-spin">⚙️</span></>
                      ) : (
                        <>Activate AI Receptionist <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Go Live */}
            {step === 3 && (
              <div className="space-y-8 animate-slide-in text-center">
                <div className="text-6xl animate-bounce">🎉</div>
                <div>
                  <h1 className="text-3xl font-bold">{form.businessName} is LIVE!</h1>
                  <p className="text-gray-400 mt-2">Your bot is ready. There's just one last thing.</p>
                </div>

                <div className="card border border-green-500/20 text-left" style={{ background: "rgba(37,211,102,0.05)" }}>
                  <div className="font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Auto-configured by AI:
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    {selectedType?.services.split("•").map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {s.trim()}
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      Tone: {selectedType?.tone}
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      Multilingual Support (Hindi + English) active
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      Appointment booking flow ready
                    </div>
                  </div>
                </div>

                <div className="card border border-yellow-500/20" style={{ background: "rgba(251,191,36,0.05)" }}>
                  <div className="font-semibold text-yellow-400 mb-2">⚡ Last Step: Connect WhatsApp</div>
                  <p className="text-sm text-gray-400 mb-4">Go to your Dashboard → Settings → Paste your WhatsApp API token. Takes 2 minutes.</p>
                  <div className="text-xs text-gray-500 bg-white/5 rounded-lg p-3 font-mono text-left">
                    Webhook URL: {(process.env.NEXT_PUBLIC_APP_URL || "https://localsuite.app") + "/api/whatsapp/webhook"}<br></br>
                    Verify Token: localsuite-verify-secret-2024
                  </div>
                </div>

                 <div className="flex flex-col gap-3">
                  <button onClick={() => router.push("/dashboard")} className="btn-primary w-full justify-center py-4 text-lg" id="go-to-dashboard">
                    Enter Your Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link href="/demo" className="btn-secondary w-full justify-center py-3">
                    View a demo first
                    <Sparkles className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { Star, Copy, RefreshCw, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const TONES = [
  { id: "friendly_hinglish", label: "Friendly Hinglish", emoji: "😊", desc: "Ji thank you! Zaroor aana!" },
  { id: "professional", label: "Professional", emoji: "👔", desc: "Formal, polished English" },
  { id: "energetic", label: "Energetic", emoji: "🔥", desc: "Pumped up & enthusiastic!" },
  { id: "premium", label: "Premium", emoji: "✨", desc: "Short, confident, classy" },
];

const SAMPLE_REVIEWS = [
  { rating: 5, text: "Best salon in the area! Rahul did an amazing job on my hair. The staff is very professional and the ambiance is great. Will definitely come back!", type: "positive" },
  { rating: 2, text: "Had to wait 45 minutes even with an appointment. The haircut was okay but not worth the wait. Staff seemed disinterested.", type: "negative" },
  { rating: 4, text: "Nice place, good service. The facial was relaxing but a bit overpriced compared to other places nearby.", type: "mixed" },
];

export default function ReviewsPage() {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [tone, setTone] = useState("friendly_hinglish");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!reviewText.trim()) return toast.error("Review text paste karo!");
    setLoading(true);
    setReply("");
    try {
      // Simulate AI response (real: calls /api/review/generate)
      await new Promise((r) => setTimeout(r, 1200));
      const mockReplies: Record<string, string[]> = {
        friendly_hinglish: [
          "Ji, bahut bahut shukriya! Aapka support humare liye bahut important hai. Jaldi milte hain! 😊",
          "Thank you so much! Itna pyaara review padhke dil khush ho gaya. Aap zaroor wapas aana! 🙏",
        ],
        professional: [
          "Thank you sincerely for taking the time to share your experience. Your kind words motivate our entire team. We look forward to welcoming you again.",
          "We truly appreciate your detailed feedback. It means a great deal to us and helps us continue improving our service.",
        ],
        energetic: [
          "WOW, this just made our entire day!!! Thank you so much for the love! Can't wait to see you again! 🔥💪",
        ],
        premium: [
          "Your words mean everything to us. We look forward to your return.",
          "Thank you. We strive for nothing less than what you experienced.",
        ],
      };
      const arr = mockReplies[tone] ?? mockReplies.professional;
      setReply(arr[Math.floor(Math.random() * arr.length)]);
    } catch {
      toast.error("Kuch galat hua. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(reply);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const charCount = reply.length;
  const isOver = charCount > 200;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Google Review Reply Generator</h1>
        <p className="text-sm text-gray-400">Paste a review → choose tone → done. Under 200 characters, every time.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Star Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} id={`star-${s}`} onClick={() => setRating(s)} className="p-1 transition-transform hover:scale-110">
                  <Star className={`w-7 h-7 ${s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Review text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Customer Review *</label>
            <textarea
              id="review-text"
              className="input-field resize-none"
              rows={5}
              placeholder="Paste the Google review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Reply Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  id={`tone-${t.id}`}
                  onClick={() => setTone(t.id)}
                  className={`rounded-xl p-3 text-left border transition-all duration-200 ${
                    tone === t.id
                      ? "border-green-500/40 bg-green-500/10"
                      : "border-white/10 glass-hover"
                  }`}
                >
                  <div className="text-lg mb-1">{t.emoji}</div>
                  <div className="text-xs font-semibold">{t.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            id="generate-reply"
            onClick={generate}
            disabled={loading}
            className="btn-primary w-full justify-center py-3 text-sm"
          >
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</> : <><Star className="w-4 h-4" />Generate Reply</>}
          </button>
        </div>

        {/* Right: Output */}
        <div className="space-y-4">
          {/* Sample reviews */}
          <div>
            <div className="text-sm font-medium text-gray-300 mb-2">Try sample reviews:</div>
            <div className="space-y-2">
              {SAMPLE_REVIEWS.map((r) => (
                <button
                  key={r.text.slice(0, 20)}
                  onClick={() => { setReviewText(r.text); setRating(r.rating); }}
                  className="w-full text-left rounded-xl p-3 glass-hover border border-white/5"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {[1,2,3,4,5].map((s) => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />)}
                    <span className={`text-xs ml-1 ${r.type === "positive" ? "text-green-400" : r.type === "negative" ? "text-red-400" : "text-yellow-400"}`}>{r.type}</span>
                  </div>
                  <div className="text-xs text-gray-400 line-clamp-2">{r.text}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generated reply */}
          {reply && (
            <div className="animate-slide-in">
              <div className="text-sm font-medium text-gray-300 mb-2">AI-Generated Reply:</div>
              <div className="rounded-2xl p-4 border border-green-500/20" style={{ background: "rgba(37,211,102,0.05)" }}>
                <p className="text-sm text-gray-200 leading-relaxed mb-3">{reply}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono ${isOver ? "text-red-400" : "text-gray-500"}`}>
                    {charCount}/200 characters
                  </span>
                  <button id="copy-reply" onClick={copy} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
                    {copied ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              {isOver && <p className="text-xs text-red-400 mt-1">⚠️ 200 chars se zyada — shorten karo</p>}
            </div>
          )}

          {!reply && !loading && (
            <div className="flex-1 flex items-center justify-center text-gray-600 py-12">
              <div className="text-center">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Reply yahan dikhega</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

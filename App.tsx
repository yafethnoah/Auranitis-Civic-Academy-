// App.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  BookOpen,
  Wrench,
  Users,
  MessageSquare,
  ShieldCheck,
  Library,
  Settings,
  ChevronLeft,
  Plus,
  Trash,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  Globe,
  Clock,
  Target,
  Download,
  Share2,
  HardDrive,
  BarChart2,
  Wallet,
  Trophy,
  Zap,
  Lightbulb,
  FileText,
  Briefcase,
  FileSpreadsheet,
  Sparkles,
  Bot,
  BrainCircuit,
  Send,
  Layers,
  Info,
  BookMarked,
  Microscope,
  LayoutGrid,
} from "lucide-react";

import { GoogleGenAI } from "@google/genai";
import { translations } from "./translations";
import { Language, Meeting, Feedback, Lesson, LibraryItem } from "./types";
import { LESSONS_DATA, LIBRARY_DATA, UNITS_METADATA } from "./constants";

/**
 * ✅ Vite client env: use import.meta.env and only VITE_* vars are exposed.
 * Put this in:
 *   - local dev: .env  => VITE_GEMINI_API_KEY=xxxxx
 *   - GitHub Actions: env => VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
 */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const AI_ENABLED = Boolean(GEMINI_API_KEY);

let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!_ai) {
    if (!GEMINI_API_KEY) {
      throw new Error("Missing VITE_GEMINI_API_KEY (Gemini API key not configured).");
    }
    _ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return _ai;
}

// --- Local Storage Service ---
const STORAGE_KEYS = {
  MEETINGS: "auranitis_meetings",
  FEEDBACK: "auranitis_feedback",
  LANGUAGE: "auranitis_lang",
  PROGRESS: "auranitis_progress",
  TOOL_DATA: "auranitis_tools",
};

const DEFAULT_TEMPLATES = {
  agenda: [
    { topic: "الافتتاح والترحيب بالأعضاء والتعريف بأجندة اللقاء", time: "5" },
    { topic: "مراجعة المبادرات السابقة وتقييم مستوى الإنجاز", time: "15" },
    { topic: "تحليل الاحتياجات العاجلة بناءً على مسح ميداني أولي", time: "20" },
    { topic: "اتخاذ قرارات بشأن توزيع الموارد المحلية المتاحة", time: "15" },
    { topic: "تحديد موعد الاجتماع القادم والاتفاق على قنوات التواصل", time: "5" },
  ],
  budget: [
    { name: "رواتب منسقين ميدانيين (عدد 2 لمدة 3 أشهر)", qty: 6, cost: 500 },
    { name: "تجهيزات مكتبية وأجهزة حاسوب محمولة (إدارة المبادرة)", qty: 2, cost: 800 },
    { name: "استئجار وتجهيز مساحة للتدريب والنشاط المجتمعي", qty: 3, cost: 300 },
    { name: "حقائب مواد تدريبية وقرطاسية شاملة لـ 30 مستفيد", qty: 30, cost: 15 },
    { name: "خدمات لوجستية وضيافة لجلسات الحوار المجتمعي", qty: 10, cost: 40 },
    { name: "تكاليف اتصالات وإنترنت للفريق الميداني", qty: 3, cost: 25 },
    { name: "صندوق للطوارئ والاحتياجات غير المتوقعة", qty: 1, cost: 200 },
  ],
  matrix: [
    { activity: "صيانة شبكة الصرف الصحي في الشارع الرئيسي", impact: "high", effort: "high" },
    { activity: "تنظيم حملة تنظيف دورية للحدائق العامة", impact: "medium", effort: "low" },
    { activity: "إنشاء مركز تدريب مهني للشباب المتعطلين", impact: "high", effort: "high" },
    { activity: "توفير وجبات غذائية يومية للعائلات الأشد فقراً", impact: "high", effort: "medium" },
    { activity: "ترميم المدرسة الابتدائية المتضررة في الحي", impact: "high", effort: "high" },
  ],
  survey: [
    { question: "ما هو العائق الرئيسي أمام وصولكم إلى الخدمات الصحية؟", type: "choice", options: ["التكلفة", "المسافة", "نقص الأدوية"] },
    { question: "كيف تقيم جودة المياه المتوفرة حالياً؟", type: "rating" },
    { question: "هل تشعر بالأمان والخصوصية داخل مكان إقامتك؟", type: "rating" },
  ],
};

const storage = {
  get: <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T,>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

// --- Helper Components ---
const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className = "",
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className} ${
      onClick ? "cursor-pointer hover:shadow-md transition-all active:scale-[0.98]" : ""
    }`}
  >
    {children}
  </div>
);

const Button: React.FC<{
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success" | "black" | "red-pill" | "gradient" | "ai";
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
}> = ({ children, variant = "primary", onClick, className = "", disabled = false }) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-sm border border-slate-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    ghost: "bg-transparent text-slate-400 hover:bg-slate-50 border border-slate-200",
    black: "bg-[#0f172a] text-white hover:bg-black shadow-sm",
    "red-pill": "bg-rose-500 text-white hover:bg-rose-600 rounded-full shadow-lg shadow-rose-200/50 relative overflow-hidden",
    gradient: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl shadow-purple-200/50",
    ai: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-100/50 hover:opacity-95",
  };
  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(e);
      }}
      className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
        variants[variant]
      } ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
};

// --- AI Chat Widget Component ---
const AIChatWidget: React.FC<{ lang: Language }> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      if (!AI_ENABLED) {
        throw new Error("Missing VITE_GEMINI_API_KEY (Gemini API key not configured).");
      }

      const response = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: `You are the Auranitis Academy AI Assistant.
Your goal is to help Syrian citizens understand Good Governance, Civic Rights, and Local Administration.
Always maintain a professional, neutral, and educational tone.
Respond in ${lang === "ar" ? "Arabic" : "English"}.
Encourage ethical participation and transparency.`,
        },
      });

      const aiText = response.text || "I'm sorry, I couldn't process that.";
      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch (error: any) {
      const msg =
        String(error?.message || "").includes("VITE_GEMINI_API_KEY")
          ? lang === "ar"
            ? "⚠️ لم يتم إعداد مفتاح Gemini. الرجاء إضافة VITE_GEMINI_API_KEY."
            : "⚠️ Gemini API key is not configured. Please set VITE_GEMINI_API_KEY."
          : lang === "ar"
          ? "حدث خطأ أثناء الاتصال بالمساعد. حاول مرة أخرى."
          : "Error connecting to AI. Please try again.";
      setMessages((prev) => [...prev, { role: "ai", text: msg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col mb-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-indigo-600 text-white rounded-t-3xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-bold">{lang === "ar" ? "المساعد الذكي" : "AI Assistant"}</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                <BrainCircuit size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm font-bold">
                  {lang === "ar"
                    ? "اسألني أي شيء عن الحوكمة والتربية المدنية"
                    : "Ask me anything about governance and civic education"}
                </p>
                {!AI_ENABLED && (
                  <p className="text-xs mt-3 text-rose-500 font-bold">
                    {lang === "ar"
                      ? "تنبيه: لم يتم إعداد مفتاح Gemini."
                      : "Note: Gemini key is not configured."}
                  </p>
                )}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-start flex-row-reverse" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm font-bold ${
                    m.role === "user"
                      ? "bg-indigo-100 text-indigo-900 rounded-br-none"
                      : "bg-slate-100 text-slate-800 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-3 rounded-2xl rounded-bl-none animate-pulse text-xs text-slate-400 font-bold">
                  ... AI is thinking
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t flex gap-2">
            <input
              className="flex-1 bg-slate-50 rounded-xl px-4 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder={lang === "ar" ? "اكتب سؤالك هنا..." : "Type your question..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button variant="primary" onClick={sendMessage} className="p-2 h-10 w-10" disabled={!AI_ENABLED}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative"
      >
        {isOpen ? <X size={28} /> : <Sparkles size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -left-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};

// --- View Components ---

const HomeView: React.FC<{ onNavigate: (view: string) => void; lang: Language }> = ({ onNavigate, lang }) => {
  const t = translations[lang];
  const progress = storage.get<Record<string, any>>(STORAGE_KEYS.PROGRESS, {});
  const completedCount = Object.values(progress).filter((p: any) => p?.completed).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 text-right">
        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">{t.appTitle}</h1>
        <p className="text-slate-500 text-lg">{t.tagline}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card onClick={() => onNavigate("lessons")} className="group border-l-4 border-l-indigo-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BookOpen className="w-8 h-8" />
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {completedCount}/{LESSONS_DATA.length} {lang === "ar" ? "مكتمل" : "Done"}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{t.lessons}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            المنهج الوطني للتربية المدنية: {UNITS_METADATA.length} وحدات تعليمية متكاملة لجميع المستويات.
          </p>
        </Card>

        <Card onClick={() => onNavigate("toolkit")} className="group border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Wrench className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">{t.toolkit}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            نماذج عملية جاهزة للاستخدام: جداول أعمال، مصفوفات أولويات، وأدوات تخطيط مجتمعي.
          </p>
        </Card>

        <Card onClick={() => onNavigate("meetings")} className="group border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Users className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-amber-600 transition-colors">{t.meetings}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            وثّق اجتماعاتك وقراراتك المحلية لضمان الشفافية والمساءلة وحفظ الحقوق.
          </p>
        </Card>

        <Card onClick={() => onNavigate("feedback")} className="group border-l-4 border-l-rose-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-rose-600 transition-colors">{t.feedback}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            آلية تواصل آمنة وسرية لإيصال أصوات المجتمع واحتياجاتهم للجهات المسؤولة.
          </p>
        </Card>

        <Card onClick={() => onNavigate("library")} className="group border-l-4 border-l-violet-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-violet-50 rounded-2xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <Library className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-violet-600 transition-colors">{t.library}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            مكتبة مرجعية شاملة تضم أدلة تدريبية، مناهج ToT، ونصوص قانونية هامة.
          </p>
        </Card>

        <Card onClick={() => onNavigate("settings")} className="group border-l-4 border-l-slate-400">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-600 group-hover:bg-slate-600 group-hover:text-white transition-colors">
              <Settings className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-slate-600 transition-colors">{t.settings}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">تخصيص التطبيق، تغيير اللغة، ومراجعة سياسات الخصوصية والأمان الرقمي.</p>
        </Card>
      </div>

      <div className="bg-indigo-600 rounded-[2.5rem] p-10 mt-12 flex flex-col md:flex-row items-center gap-10 text-white shadow-2xl shadow-indigo-200">
        <div className="flex-1 text-right">
          <h3 className="text-3xl font-black mb-4">مستقبل سوريا يُبنى بالمعرفة</h3>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8 opacity-90">
            أكاديمية أورانيتيس هي مساحتك الخاصة للتعلم والمبادرة. انضم إلى آلاف السوريين الذين يتعلمون يومياً كيفية بناء
            مجتمعات أكثر عدلاً وشفافية.
          </p>
          <div className="flex gap-4 justify-end">
            <Button onClick={() => onNavigate("lessons")} className="bg-white !text-indigo-600 hover:bg-indigo-50 px-8 py-4 text-lg">
              {t.startLearning}
            </Button>
            <Button variant="ai" className="px-8 py-4 text-lg" onClick={() => {}} disabled={!AI_ENABLED}>
              <Bot className="w-5 h-5" /> {lang === "ar" ? "اسأل المساعد الذكي" : "Ask AI"}
            </Button>
          </div>
        </div>
        <div className="hidden md:flex w-64 h-64 bg-white/10 rounded-3xl items-center justify-center backdrop-blur-sm border border-white/20">
          <Trophy className="w-32 h-32 text-white/50" />
        </div>
      </div>
    </div>
  );
};

interface LessonProgress {
  completed: boolean;
  reflection: string;
  quiz_score?: number;
}

const LessonsView: React.FC<{ lang: Language }> = ({ lang }) => {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [progress, setProgress] = useState<Record<string, LessonProgress>>(() => storage.get(STORAGE_KEYS.PROGRESS, {}));
  const t = translations[lang];

  const updateProgress = (id: string, updates: Partial<LessonProgress>) => {
    const newProgress = {
      ...progress,
      [id]: {
        completed: progress[id]?.completed || false,
        reflection: progress[id]?.reflection || "",
        ...updates,
      },
    };
    setProgress(newProgress);
    storage.set(STORAGE_KEYS.PROGRESS, newProgress);
  };

  const generateAIInsight = async () => {
    if (!selectedLesson || isAiLoading) return;
    setIsAiLoading(true);
    setAiInsight(null);
    try {
      if (!AI_ENABLED) throw new Error("Missing VITE_GEMINI_API_KEY (Gemini API key not configured).");
      const response = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a future-oriented insight for the lesson: "${selectedLesson.title.ar}".
The context is civic education and governance in Syria.
Focus on how this lesson helps build a better community in 5 years. Respond in 2-3 short sentences in ${
          lang === "ar" ? "Arabic" : "English"
        }.`,
      });
      setAiInsight(response.text || "No insights available.");
    } catch (e: any) {
      setAiInsight(
        String(e?.message || "").includes("VITE_GEMINI_API_KEY")
          ? lang === "ar"
            ? "⚠️ لم يتم إعداد مفتاح Gemini."
            : "⚠️ Gemini key is not configured."
          : "Unable to generate AI insight at the moment."
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!selectedLesson || isAiLoading) return;
    setIsAiLoading(true);
    setAiSummary(null);
    try {
      if (!AI_ENABLED) throw new Error("Missing VITE_GEMINI_API_KEY (Gemini API key not configured).");
      const response = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on the lesson content: "${selectedLesson.sections.join(" ")}", generate a concise summary of the 3 most important key takeaways for a citizen learning about "${selectedLesson.title.ar}".
Use bullet points. Respond in ${lang === "ar" ? "Arabic" : "English"}.`,
      });
      setAiSummary(response.text || "No summary available.");
    } catch (e: any) {
      setAiSummary(
        String(e?.message || "").includes("VITE_GEMINI_API_KEY")
          ? lang === "ar"
            ? "⚠️ لم يتم إعداد مفتاح Gemini."
            : "⚠️ Gemini key is not configured."
          : "Unable to generate summary."
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateExplanation = async () => {
    if (!selectedLesson || isAiLoading) return;
    setIsAiLoading(true);
    setAiExplanation(null);
    try {
      if (!AI_ENABLED) throw new Error("Missing VITE_GEMINI_API_KEY (Gemini API key not configured).");
      const response = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a full, detailed educational explanation about "${selectedLesson.title.ar}".
The material should be written for a general Syrian public audience.
Explain the concept, why it's important for local governance, and how citizens should apply it.
Be comprehensive but clear. Respond in ${lang === "ar" ? "Arabic" : "English"}.`,
      });
      setAiExplanation(response.text || "Explanation currently unavailable.");
    } catch (e: any) {
      setAiExplanation(
        String(e?.message || "").includes("VITE_GEMINI_API_KEY")
          ? lang === "ar"
            ? "⚠️ لم يتم إعداد مفتاح Gemini."
            : "⚠️ Gemini key is not configured."
          : "Error generating detailed explanation."
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const getUnitProgress = (unitId: string) => {
    const unitLessons = LESSONS_DATA.filter((l) => l.unitId === unitId);
    const completed = unitLessons.filter((l) => progress[l.id]?.completed).length;
    return {
      percent: unitLessons.length > 0 ? (completed / unitLessons.length) * 100 : 0,
      completed,
      total: unitLessons.length,
    };
  };

  if (selectedLesson) {
    const totalSteps = 1 + selectedLesson.sections.length + 2;

    const handleAnswer = (qIndex: number, answer: any) => {
      setQuizAnswers((prev) => ({ ...prev, [qIndex]: answer }));
    };

    const calculateQuizScore = () => {
      let score = 0;
      selectedLesson.questions.forEach((q, i) => {
        if (q.type === "mcq" && quizAnswers[i] === q.correct_index) score++;
        if (q.type === "truefalse" && quizAnswers[i] === q.correct) score++;
      });
      return score;
    };

    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedLesson(null);
              setCurrentStep(0);
              setShowQuizResults(false);
              setAiInsight(null);
              setAiSummary(null);
              setAiExplanation(null);
            }}
            className="text-slate-600 bg-white border border-slate-200 shadow-sm flex-row-reverse gap-2"
          >
            <ChevronLeft className="w-5 h-5 ml-1" />
            العودة للوحدة
          </Button>

          <div className="flex-1 px-8">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
            </div>
          </div>
        </div>

        <Card className="p-10 border-slate-100 text-right">
          {currentStep === 0 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-start gap-4 flex-row-reverse">
                <div className="flex flex-col gap-2 items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                    {selectedLesson.category.toUpperCase()} | {selectedLesson.level}
                  </span>
                  <h2 className="text-4xl font-black text-slate-900 leading-tight">{selectedLesson.title[lang]}</h2>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <Clock className="w-5 h-5" /> <span>{selectedLesson.duration}</span>
                </div>
              </div>

              <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                <h3 className="text-xl font-black text-indigo-800 mb-6 flex items-center justify-end gap-3">
                  أهداف التعلم <Target className="w-6 h-6" />
                </h3>
                <ul className="space-y-4">
                  {selectedLesson.learning_outcomes.map((o, i) => (
                    <li key={i} className="flex items-center justify-end gap-3 text-lg text-slate-600 font-bold">
                      {o} <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-violet-50 p-6 rounded-3xl border border-violet-100 relative overflow-hidden flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 flex-row-reverse">
                      <h3 className="text-sm font-black text-violet-800 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> {lang === "ar" ? "رؤية ذكية" : "AI Insight"}
                      </h3>
                      {!aiInsight && !isAiLoading && (
                        <Button variant="ai" onClick={generateAIInsight} className="py-1.5 text-[9px] px-2.5" disabled={!AI_ENABLED}>
                          {lang === "ar" ? "توليد" : "Run"}
                        </Button>
                      )}
                    </div>
                    {isAiLoading && !aiInsight && <div className="animate-pulse text-violet-400 font-bold text-[10px]">... Thinking</div>}
                    {aiInsight && <p className="text-violet-700 text-xs font-bold leading-relaxed">{aiInsight}</p>}
                  </div>

                  <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 relative overflow-hidden flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 flex-row-reverse">
                      <h3 className="text-sm font-black text-indigo-800 flex items-center gap-2">
                        <Layers className="w-4 h-4" /> {lang === "ar" ? "ملخص سريع" : "AI Summary"}
                      </h3>
                      {!aiSummary && !isAiLoading && (
                        <Button
                          variant="ai"
                          onClick={generateSummary}
                          className="py-1.5 text-[9px] px-2.5 !bg-indigo-600"
                          disabled={!AI_ENABLED}
                        >
                          {lang === "ar" ? "تلخيص" : "Sum"}
                        </Button>
                      )}
                    </div>
                    {isAiLoading && !aiSummary && <div className="animate-pulse text-indigo-400 font-bold text-[10px]">... Processing</div>}
                    {aiSummary && <div className="text-indigo-700 text-xs font-bold leading-relaxed whitespace-pre-line">{aiSummary}</div>}
                  </div>

                  <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 relative overflow-hidden flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 flex-row-reverse">
                      <h3 className="text-sm font-black text-emerald-800 flex items-center gap-2">
                        <Info className="w-4 h-4" /> {lang === "ar" ? "شرح مفصل" : "Full Explanation"}
                      </h3>
                      {!aiExplanation && !isAiLoading && (
                        <Button
                          variant="ai"
                          onClick={generateExplanation}
                          className="py-1.5 text-[9px] px-2.5 !bg-emerald-600"
                          disabled={!AI_ENABLED}
                        >
                          {lang === "ar" ? "توليد الشرح" : "Explain"}
                        </Button>
                      )}
                    </div>
                    {isAiLoading && !aiExplanation && <div className="animate-pulse text-emerald-400 font-bold text-[10px]">... Explaining</div>}
                    {aiExplanation && <div className="text-emerald-700 text-xs font-bold leading-relaxed">{aiExplanation.substring(0, 150)}...</div>}
                  </div>
                </div>

                {aiExplanation && (
                  <div className="bg-white p-8 rounded-3xl border-2 border-emerald-100 shadow-xl animate-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center mb-6 flex-row-reverse border-b border-emerald-50 pb-4">
                      <h3 className="text-xl font-black text-emerald-800 flex items-center gap-3">
                        <Bot className="w-6 h-6" /> {lang === "ar" ? "المعلم الذكي: شرح شامل للمادة" : "AI Tutor: Full Explanation"}
                      </h3>
                      <button onClick={() => setAiExplanation(null)} className="text-slate-300 hover:text-slate-500">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="text-slate-700 text-lg leading-relaxed font-bold whitespace-pre-line text-right">{aiExplanation}</div>
                  </div>
                )}
              </div>

              <Button onClick={() => setCurrentStep(1)} className="w-full py-4 text-xl">
                ابدأ الدرس الآن
              </Button>
            </div>
          )}

          {currentStep >= 1 && currentStep <= selectedLesson.sections.length && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-4 flex-row-reverse">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                  قسم {currentStep} من {selectedLesson.sections.length}
                </span>
                <Lightbulb className="text-amber-400 w-8 h-8" />
              </div>
              <p className="text-2xl leading-relaxed text-slate-700 font-bold">{selectedLesson.sections[currentStep - 1]}</p>
              <div className="flex gap-4">
                <Button onClick={() => setCurrentStep(currentStep + 1)} className="flex-1 py-4 text-lg">
                  التالي
                </Button>
                <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)} className="py-4 text-lg">
                  السابق
                </Button>
              </div>
            </div>
          )}

          {currentStep === selectedLesson.sections.length + 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
                <h3 className="text-xl font-black text-amber-800 mb-6 flex items-center justify-end gap-3">
                  دراسة حالة / سيناريو <Briefcase className="w-6 h-6" />
                </h3>
                <p className="text-2xl text-slate-700 leading-relaxed italic">{selectedLesson.scenario}</p>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setCurrentStep(currentStep + 1)} className="flex-1 py-4 text-lg">
                  فهمت، لننتقل للاختبار
                </Button>
                <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)} className="py-4 text-lg">
                  مراجعة الأقسام
                </Button>
              </div>
            </div>
          )}

          {currentStep === selectedLesson.sections.length + 2 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center justify-end gap-3">
                اختبر معلوماتك <Zap className="w-6 h-6 text-yellow-500" />
              </h3>
              <div className="space-y-10">
                {selectedLesson.questions.map((q, i) => (
                  <div key={i} className="space-y-4">
                    <p className="text-xl font-bold text-slate-700">
                      س{i + 1}. {q.text}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.type === "mcq" ? (
                        q.options?.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswer(i, optIdx)}
                            className={`p-4 rounded-2xl border-2 text-right transition-all font-bold ${
                              quizAnswers[i] === optIdx
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "border-slate-100 hover:border-indigo-100 text-slate-600"
                            }`}
                          >
                            {opt}
                          </button>
                        ))
                      ) : (
                        ["صح", "خطأ"].map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswer(i, optIdx === 0)}
                            className={`p-4 rounded-2xl border-2 text-right transition-all font-bold ${
                              quizAnswers[i] === (optIdx === 0)
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "border-slate-100 hover:border-indigo-100 text-slate-600"
                            }`}
                          >
                            {opt}
                          </button>
                        ))
                      )}
                    </div>
                    {showQuizResults && (
                      <div
                        className={`p-4 rounded-xl text-sm ${
                          (q.type === "mcq" && quizAnswers[i] === q.correct_index) ||
                          (q.type === "truefalse" && quizAnswers[i] === q.correct)
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!showQuizResults ? (
                <Button
                  onClick={() => setShowQuizResults(true)}
                  className="w-full py-4"
                  disabled={Object.keys(quizAnswers).length < selectedLesson.questions.length}
                >
                  تأكيد الإجابات
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-6 bg-slate-50 rounded-3xl">
                    <p className="text-slate-500 font-bold">نتيجتك النهائية</p>
                    <h4 className="text-5xl font-black text-indigo-600 mt-2">
                      {calculateQuizScore()} / {selectedLesson.questions.length}
                    </h4>
                  </div>
                  <Button onClick={() => setCurrentStep(currentStep + 1)} className="w-full py-4 text-lg">
                    خاتمة وتأمل
                  </Button>
                </div>
              )}
            </div>
          )}

          {currentStep === selectedLesson.sections.length + 3 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-[#FDFBF2] rounded-3xl p-8 border border-[#F2E8C4]">
                <h4 className="font-bold text-[#8C6A2E] flex items-center justify-end gap-3 mb-4 text-lg">
                  مساحة للتأمل والتطبيق العملي
                  <AlertCircle className="w-6 h-6" />
                </h4>
                <div className="space-y-4 mb-6">
                  {selectedLesson.reflection[lang].map((r, i) => (
                    <p key={i} className="text-[#8C6A2E] text-lg italic leading-relaxed opacity-90">
                      "{r}"
                    </p>
                  ))}
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 min-h-[150px] shadow-inner p-6">
                  <textarea
                    className="w-full h-full border-none focus:ring-0 text-slate-800 placeholder:text-slate-300 text-lg bg-transparent text-right"
                    placeholder="اكتب أفكارك هنا..."
                    rows={4}
                    value={progress[selectedLesson.id]?.reflection || ""}
                    onChange={(e) => updateProgress(selectedLesson.id, { reflection: e.target.value })}
                  />
                </div>
              </div>

              <Button
                variant="success"
                onClick={() => {
                  updateProgress(selectedLesson.id, { completed: true });
                  setSelectedLesson(null);
                  setCurrentStep(0);
                  setAiExplanation(null);
                  setAiSummary(null);
                  setAiInsight(null);
                }}
                className="w-full py-4 text-xl"
              >
                إنهاء الدرس والحصول على النقاط
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (selectedUnit) {
    const unit = UNITS_METADATA.find((u) => u.id === selectedUnit);
    const lessons = LESSONS_DATA.filter((l) => l.unitId === selectedUnit);
    const p = getUnitProgress(selectedUnit);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between flex-row-reverse">
          <Button variant="secondary" onClick={() => setSelectedUnit(null)} className="flex-row-reverse gap-2">
            <ChevronLeft className="w-5 h-5 ml-1" /> المنهج الوطني
          </Button>
          <div className="text-right">
            <h2 className="text-3xl font-black text-slate-900">{unit?.title[lang]}</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{selectedUnit} - Course Unit</p>
          </div>
        </div>

        <Card className="bg-indigo-600 text-white p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl flex-row-reverse">
          <div className="flex-1 text-right">
            <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-2">إنجاز الوحدة</p>
            <h4 className="text-5xl font-black">{Math.round(p.percent)}%</h4>
          </div>
          <div className="w-48 h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${p.percent}%` }} />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <Card
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className={`hover:border-indigo-200 transition-all ${progress[lesson.id]?.completed ? "bg-emerald-50/20 border-emerald-100" : ""}`}
            >
              <div className="flex justify-between items-start mb-6 flex-row-reverse">
                <span
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    lesson.level === "basic"
                      ? "bg-blue-50 text-blue-600"
                      : lesson.level === "advanced"
                      ? "bg-purple-50 text-purple-600"
                      : "bg-orange-50 text-orange-600"
                  }`}
                >
                  {lesson.level}
                </span>
                {progress[lesson.id]?.completed && <CheckCircle className="text-emerald-500 w-5 h-5" />}
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-4">{lesson.title[lang]}</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Clock className="w-4 h-4" /> {lesson.duration}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 text-right">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">المنهج الوطني</h2>
        <p className="text-slate-500 text-xl max-w-2xl">
          خطة تعليمية شاملة من {UNITS_METADATA.length} وحدات تهدف لرفع الوعي المدني والحقوقي لجميع السوريين.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {UNITS_METADATA.map((unit) => {
          const p = getUnitProgress(unit.id);
          return (
            <Card key={unit.id} onClick={() => setSelectedUnit(unit.id)} className="group border-2 border-transparent hover:border-indigo-100 p-8">
              <div className="flex flex-row-reverse items-center gap-6">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {unit.id.replace("U", "")}
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-2xl font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{unit.title[lang]}</h3>
                  <div className="flex items-center justify-end gap-3 mt-4">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${p.percent}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {p.completed}/{p.total}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// --- Toolkit View ---
const ToolkitView: React.FC<{ lang: Language }> = ({ lang }) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const [agendaObjective, setAgendaObjective] = useState("");
  const [budgetItems] = useState(DEFAULT_TEMPLATES.budget);
  const [matrixActivities] = useState(DEFAULT_TEMPLATES.matrix);
  const [surveyQuestions] = useState(DEFAULT_TEMPLATES.survey);

  const t = translations[lang];

  const safeRunAI = async (fn: () => Promise<void>) => {
    setAiLoading(true);
    setAiResult(null);
    try {
      if (!AI_ENABLED) throw new Error("Missing VITE_GEMINI_API_KEY (Gemini API key not configured).");
      await fn();
    } catch (e: any) {
      setAiResult(
        String(e?.message || "").includes("VITE_GEMINI_API_KEY")
          ? lang === "ar"
            ? "⚠️ لم يتم إعداد مفتاح Gemini. الرجاء إضافة VITE_GEMINI_API_KEY."
            : "⚠️ Gemini key is not configured. Please set VITE_GEMINI_API_KEY."
          : lang === "ar"
          ? "خطأ في توليد/تحليل الذكاء الاصطناعي."
          : "AI Generation/Analysis Error"
      );
    } finally {
      setAiLoading(false);
    }
  };

  const runAgendaAI = async () => {
    if (!agendaObjective.trim()) return;
    await safeRunAI(async () => {
      const response = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a professional meeting agenda for a civic community meeting with the objective: "${agendaObjective}".
Include timing for each item and suggest 5 key topics. Respond in ${lang === "ar" ? "Arabic" : "English"}.`,
      });
      setAiResult(response.text || "");
    });
  };

  const runBudgetAI = async () => {
    await safeRunAI(async () => {
      const itemsStr = budgetItems.map((i) => `${i.name}: ${i.qty} x ${i.cost}`).join("\n");
      const response = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this community initiative budget:\n${itemsStr}\n
Provide 3 cost-saving suggestions and 2 essential items that might be missing for transparency and accountability in a Syrian local context. Respond in ${
          lang === "ar" ? "Arabic" : "English"
        }.`,
      });
      setAiResult(response.text || "");
    });
  };

  const runMatrixAI = async () => {
    await safeRunAI(async () => {
      const activities = matrixActivities.map((a) => a.activity).join(", ");
      const response = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Help prioritize these community activities: ${activities}.
Categorize each into one of: 'Quick Wins' (High Impact, Low Effort), 'Major Projects' (High Impact, High Effort), 'Fill-ins' (Low Impact, Low Effort), or 'Thankless Tasks' (Low Impact, High Effort).
Explain why for each based on building community trust. Respond in ${lang === "ar" ? "Arabic" : "English"}.`,
      });
      setAiResult(response.text || "");
    });
  };

  const runSurveyAI = async () => {
    await safeRunAI(async () => {
      const response = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on current civic needs in Syria, generate 5 highly effective survey questions to measure 'Citizen Satisfaction with Local Council Transparency'.
Include a mix of multiple choice and rating scales. Respond in ${lang === "ar" ? "Arabic" : "English"}.`,
      });
      setAiResult(response.text || "");
    });
  };

  const tools = [
    { id: "agenda", title: { ar: "مولد جداول الأعمال", en: "Agenda Generator" }, icon: FileText, color: "text-blue-500" },
    { id: "budget", title: { ar: "مخطط الموازنات المجتمعية", en: "Community Budgeter" }, icon: Wallet, color: "text-emerald-500" },
    { id: "matrix", title: { ar: "مصفوفة الأولويات", en: "Priority Matrix" }, icon: BarChart2, color: "text-amber-500" },
    { id: "survey", title: { ar: "مسح الاحتياجات السريع", en: "Rapid Needs Survey" }, icon: FileSpreadsheet, color: "text-rose-500" },
  ];

  if (activeTool === "agenda") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 text-right">
        <Button variant="secondary" onClick={() => { setActiveTool(null); setAiResult(null); }} className="flex-row-reverse gap-2">
          <ChevronLeft size={18} /> {t.allTools}
        </Button>

        <Card className="p-8">
          <h2 className="text-2xl font-black mb-6">مولد جداول أعمال الاجتماعات</h2>

          <div className="mb-8">
            <label className="block text-sm font-black text-slate-400 mb-2">ما هو هدف الاجتماع الرئيسي؟</label>
            <div className="flex gap-4 flex-row-reverse">
              <input
                className="flex-1 bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                placeholder="مثال: مناقشة أزمة المياه في الحي"
                value={agendaObjective}
                onChange={(e) => setAgendaObjective(e.target.value)}
              />
              <Button variant="ai" onClick={runAgendaAI} disabled={aiLoading || !agendaObjective || !AI_ENABLED}>
                <Sparkles size={18} /> {lang === "ar" ? "اقتراح ذكي" : "AI Suggest"}
              </Button>
            </div>
          </div>

          {aiResult && (
            <div className="mb-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-800 text-lg font-bold whitespace-pre-line animate-in zoom-in-95">
              {aiResult}
            </div>
          )}

          <div className="space-y-4">
            {DEFAULT_TEMPLATES.agenda.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex-row-reverse">
                <div className="flex-1 font-bold text-slate-700">{item.topic}</div>
                <div className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-black">{item.time} دقيقة</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (activeTool === "budget") {
    const total = budgetItems.reduce((acc, curr) => acc + curr.qty * curr.cost, 0);
    return (
      <div className="space-y-6 animate-in fade-in duration-300 text-right">
        <Button variant="secondary" onClick={() => { setActiveTool(null); setAiResult(null); }} className="flex-row-reverse gap-2">
          <ChevronLeft size={18} /> {t.allTools}
        </Button>

        <Card className="p-8">
          <div className="flex justify-between items-center mb-6 flex-row-reverse">
            <h2 className="text-2xl font-black">مخطط موازنة المبادرات المحلية</h2>
            <Button variant="ai" onClick={runBudgetAI} disabled={aiLoading || !AI_ENABLED}>
              <Microscope size={18} /> {lang === "ar" ? "تدقيق ذكي" : "AI Audit"}
            </Button>
          </div>

          {aiResult && (
            <div className="mb-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-lg font-bold whitespace-pre-line animate-in zoom-in-95">
              {aiResult}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-right">
              <thead className="bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-widest">
                <tr>
                  <th className="p-4">البند</th>
                  <th className="p-4">الكمية</th>
                  <th className="p-4">سعر الوحدة</th>
                  <th className="p-4">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold text-slate-700">
                {budgetItems.map((item, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">{item.qty}</td>
                    <td className="p-4">${item.cost}</td>
                    <td className="p-4">${item.qty * item.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <div className="bg-indigo-600 text-white p-6 rounded-2xl text-right">
              <p className="text-xs opacity-70 mb-1">الموازنة الكلية التقديرية</p>
              <h4 className="text-3xl font-black">${total}</h4>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (activeTool === "matrix") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 text-right">
        <Button variant="secondary" onClick={() => { setActiveTool(null); setAiResult(null); }} className="flex-row-reverse gap-2">
          <ChevronLeft size={18} /> {t.allTools}
        </Button>

        <Card className="p-8">
          <div className="flex justify-between items-center mb-8 flex-row-reverse">
            <h2 className="text-2xl font-black">مصفوفة أولويات المجتمع</h2>
            <Button variant="ai" onClick={runMatrixAI} disabled={aiLoading || !AI_ENABLED}>
              <BrainCircuit size={18} /> {lang === "ar" ? "تحليل الأولويات" : "Analyze Priorities"}
            </Button>
          </div>

          {aiResult && (
            <div className="mb-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-lg font-bold whitespace-pre-line animate-in zoom-in-95">
              {aiResult}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matrixActivities.map((m, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="font-black text-slate-800 mb-4">{m.activity}</p>
                <div className="flex gap-2 flex-row-reverse">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${m.impact === "high" ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-500"}`}>
                    الأثر: {m.impact}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${m.effort === "low" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                    الجهد: {m.effort}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (activeTool === "survey") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 text-right">
        <Button variant="secondary" onClick={() => { setActiveTool(null); setAiResult(null); }} className="flex-row-reverse gap-2">
          <ChevronLeft size={18} /> {t.allTools}
        </Button>

        <Card className="p-8">
          <div className="flex justify-between items-center mb-8 flex-row-reverse">
            <h2 className="text-2xl font-black">مسح الاحتياجات السريع</h2>
            <Button variant="ai" onClick={runSurveyAI} disabled={aiLoading || !AI_ENABLED}>
              <LayoutGrid size={18} /> {lang === "ar" ? "توليد أسئلة" : "Generate Questions"}
            </Button>
          </div>

          {aiResult && (
            <div className="mb-8 p-6 bg-rose-50 rounded-2xl border border-rose-100 text-rose-800 text-lg font-bold whitespace-pre-line animate-in zoom-in-95">
              {aiResult}
            </div>
          )}

          <div className="space-y-6">
            {surveyQuestions.map((q, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="font-black text-slate-800 mb-4">{q.question}</p>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نوع السؤال: {q.type}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right">
      <div className="text-center">
        <h2 className="text-4xl font-black mb-4">{t.toolkit}</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          مجموعة متكاملة من الأدوات الرقمية لمساعدة اللجان والفرق التطوعية على تنظيم عملها بمهنية وشفافية.
        </p>
        {!AI_ENABLED && (
          <p className="mt-3 text-xs font-black text-rose-500">
            {lang === "ar" ? "تنبيه: أدوات الذكاء الاصطناعي متوقفة لأن المفتاح غير مُعد." : "AI tools disabled: missing key."}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className="flex items-center gap-6 group hover:border-indigo-200 transition-all flex-row-reverse"
          >
            <div className={`p-4 bg-slate-50 rounded-2xl ${tool.color} group-hover:bg-white transition-colors`}>
              <tool.icon size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black group-hover:text-indigo-600 transition-colors">{tool.title[lang]}</h3>
              <p className="text-sm text-slate-400">أداة تفاعلية للمساعدة في التنظيم المدني.</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- Meetings View ---
const MeetingsView: React.FC<{ lang: Language }> = ({ lang }) => {
  const [meetings, setMeetings] = useState<Meeting[]>(() => storage.get(STORAGE_KEYS.MEETINGS, []));
  const [showForm, setShowForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({ title: "", attendees: [], agenda: [], decisions: [] });
  const t = translations[lang];

  const saveMeeting = () => {
    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title || "اجتماع بدون عنوان",
      date: new Date().toLocaleDateString(),
      attendees: newMeeting.attendees || [],
      agenda: newMeeting.agenda || [],
      decisions: (newMeeting.decisions || []).map((d: any) => ({ ...d, status: d.status || "pending" })),
    };
    const updated = [meeting, ...meetings];
    setMeetings(updated);
    storage.set(STORAGE_KEYS.MEETINGS, updated);
    setShowForm(false);
    setNewMeeting({ title: "", attendees: [], agenda: [], decisions: [] });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right">
      <div className="flex justify-between items-center flex-row-reverse">
        <h2 className="text-3xl font-black">{t.meetings}</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={20} /> {t.newMeeting}
        </Button>
      </div>

      {showForm && (
        <Card className="border-2 border-indigo-100 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-slate-400 mb-2">عنوان الاجتماع</label>
              <input
                className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              />
            </div>
            <div className="flex gap-4">
              <Button variant="primary" onClick={saveMeeting} className="flex-1 py-4">
                {t.save}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)} className="px-8">
                {t.cancel}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        {meetings.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <Users className="w-16 h-16 mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">{t.noMeetings}</p>
          </div>
        ) : (
          meetings.map((m) => (
            <Card key={m.id} className="flex flex-row-reverse items-center justify-between group">
              <div className="flex flex-row-reverse items-center gap-6">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 font-black">
                  {m.date.split("/")[0]}
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-black group-hover:text-amber-600 transition-colors">{m.title}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{m.date}</p>
                </div>
              </div>
              <Button
                variant="danger"
                onClick={() => {
                  const updated = meetings.filter((item) => item.id !== m.id);
                  setMeetings(updated);
                  storage.set(STORAGE_KEYS.MEETINGS, updated);
                }}
                className="opacity-0 group-hover:opacity-100"
              >
                <Trash size={18} />
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// --- Feedback View ---
const FeedbackView: React.FC<{ lang: Language }> = ({ lang }) => {
  const [feedback, setFeedback] = useState<Feedback[]>(() => storage.get(STORAGE_KEYS.FEEDBACK, []));
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("governance");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const t = translations[lang];

  const submit = () => {
    if (!message) return;
    const item: Feedback = {
      id: Date.now().toString(),
      category,
      message,
      isAnonymous,
      date: new Date().toLocaleDateString(),
    };
    const updated = [item, ...feedback];
    setFeedback(updated);
    storage.set(STORAGE_KEYS.FEEDBACK, updated);
    setMessage("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right">
      <h2 className="text-3xl font-black">{t.feedback}</h2>
      <Card className="p-8 border-2 border-rose-100">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-slate-400 mb-2">{t.category}</label>
            <select
              className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-rose-500 appearance-none text-right"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="governance">الحوكمة</option>
              <option value="transparency">الشفافية</option>
              <option value="accountability">المساءلة</option>
              <option value="integrity">النزاهة</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-black text-slate-400 mb-2">{t.message}</label>
            <textarea
              rows={4}
              className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-rose-500 text-right"
              placeholder="اكتب ملاحظاتك هنا بكل شفافية..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between flex-row-reverse">
            <div className="flex items-center gap-3 flex-row-reverse">
              <button
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-12 h-6 rounded-full transition-all relative ${isAnonymous ? "bg-rose-500" : "bg-slate-200"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAnonymous ? "right-1" : "right-7"}`} />
              </button>
              <span className="text-sm font-bold text-slate-600">{t.anonymous}</span>
            </div>
            <Button variant="primary" onClick={submit} className="bg-rose-600 hover:bg-rose-700 px-8 py-4">
              {t.submitFeedback}
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {feedback.map((f) => (
          <Card key={f.id} className="border-l-4 border-l-rose-500">
            <div className="flex justify-between items-start mb-4 flex-row-reverse">
              <span className="text-xs bg-rose-50 text-rose-600 px-3 py-1 rounded-lg font-black">{f.category.toUpperCase()}</span>
              <span className="text-[10px] text-slate-400 font-bold">{f.date}</span>
            </div>
            <p className="text-slate-700 font-bold leading-relaxed text-right">{f.message}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- Library View ---
const LibraryView: React.FC<{ lang: Language }> = ({ lang }) => {
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [aiDocSummary, setAiDocSummary] = useState<string | null>(null);
  const [aiSectionExplain, setAiSectionExplain] = useState<Record<number, string>>({});
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [aiSearchResponse, setAiSearchResponse] = useState<string | null>(null);
  const t = translations[lang];

  const handleExportPDF = (item: LibraryItem) => {
    const content = item.content?.[lang] || [];
    const text = `
--------------------------------------------------
${item.title[lang]}
--------------------------------------------------
${item.description[lang]}

${content.join("\n\n")}

--------------------------------------------------
Generated by Auranitis Academy - Civic Excellence
--------------------------------------------------
    `;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.title[lang].replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const safeAI = async <T,>(setter: (v: any) => void, fn: () => Promise<T>) => {
    setIsAiLoading(true);
    try {
      if (!AI_ENABLED) throw new Error("Missing VITE_GEMINI_API_KEY (Gemini API key not configured).");
      return await fn();
    } catch (e: any) {
      setter(
        String(e?.message || "").includes("VITE_GEMINI_API_KEY")
          ? lang === "ar"
            ? "⚠️ لم يتم إعداد مفتاح Gemini."
            : "⚠️ Gemini key is not configured."
          : lang === "ar"
          ? "حدث خطأ في الذكاء الاصطناعي."
          : "AI Error"
      );
      return null;
    } finally {
      setIsAiLoading(false);
    }
  };

  const getDocSummary = async (item: LibraryItem) => {
    setAiDocSummary(null);
    await safeAI(setAiDocSummary, async () => {
      const response = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a high-level educational summary for this civic resource: "${item.title.ar}".
The description is: "${item.description.ar}".
Highlight why this resource is vital for a Syrian citizen. Use 3 short paragraphs. Respond in ${lang === "ar" ? "Arabic" : "English"}.`,
      });
      setAiDocSummary(response.text || "No summary available.");
    });
  };

  const explainSection = async (index: number, text: string) => {
    await safeAI(
      (v: string) => setAiSectionExplain((prev) => ({ ...prev, [index]: v })),
      async () => {
        const response = await getAI().models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Provide a simplified "Citizen's Guide" explanation for this specific section: "${text}".
How does this affect daily life or local governance? Keep it to 2-3 sentences. Respond in ${lang === "ar" ? "Arabic" : "English"}.`,
        });
        setAiSectionExplain((prev) => ({ ...prev, [index]: response.text || "No explanation available." }));
      }
    );
  };

  const askLibrary = async () => {
    if (!aiSearchQuery.trim()) return;
    setAiSearchResponse(null);

    await safeAI(setAiSearchResponse, async () => {
      const context = LIBRARY_DATA.map((item) => `${item.title.ar}: ${item.description.ar}`).join("\n");
      const response = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on the following library of civic resources:\n${context}\n\nAnswer this citizen's question: "${aiSearchQuery}".
Direct them to specific resources if they exist. Respond in ${lang === "ar" ? "Arabic" : "English"}.`,
      });
      setAiSearchResponse(response.text || "No answer found in the current library context.");
    });
  };

  if (selectedItem) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 text-right">
        <Button
          variant="secondary"
          onClick={() => {
            setSelectedItem(null);
            setAiDocSummary(null);
            setAiSectionExplain({});
          }}
          className="flex-row-reverse gap-2"
        >
          <ChevronLeft size={18} /> العودة للمكتبة
        </Button>

        <Card className="p-10">
          <div className="flex justify-between items-start mb-8 flex-row-reverse border-b border-slate-50 pb-6">
            <div className="text-right">
              <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedItem.title[lang]}</h2>
              <p className="text-slate-400 font-bold">{selectedItem.description[lang]}</p>
            </div>
            <Button variant="ai" onClick={() => getDocSummary(selectedItem)} disabled={isAiLoading || !AI_ENABLED}>
              <Sparkles size={18} /> {lang === "ar" ? "ملخص المرجع" : "AI Summary"}
            </Button>
          </div>

          {aiDocSummary && (
            <div className="mb-10 bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100 animate-in slide-in-from-top-2">
              <h4 className="text-indigo-800 font-black mb-4 flex items-center justify-end gap-2">
                {lang === "ar" ? "نظرة عامة ذكية" : "AI Strategic Overview"} <Layers size={18} />
              </h4>
              <div className="text-indigo-700 text-lg leading-relaxed font-bold whitespace-pre-line">{aiDocSummary}</div>
            </div>
          )}

          <div className="space-y-8">
            <h3 className="text-xl font-black text-slate-800 flex items-center justify-end gap-3">
              {lang === "ar" ? "محتويات المرجع" : "Document Contents"} <BookMarked size={22} className="text-indigo-500" />
            </h3>

            {selectedItem.content?.[lang]?.map((p, i) => (
              <div key={i} className="group relative">
                <div className="flex items-start gap-6 flex-row-reverse p-6 rounded-[2rem] bg-slate-50/30 border border-transparent hover:border-indigo-100 hover:bg-white transition-all">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-black text-sm flex-shrink-0 shadow-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-slate-700 leading-relaxed font-bold">{p}</p>

                    {aiSectionExplain[i] && (
                      <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-sm font-bold animate-in zoom-in-95">
                        <div className="flex items-center gap-2 mb-1 flex-row-reverse text-[10px] text-emerald-600">
                          <Bot size={12} /> {lang === "ar" ? "توضيح مدني" : "Civic Breakdown"}
                        </div>
                        {aiSectionExplain[i]}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => explainSection(i, p)}
                    disabled={isAiLoading || !AI_ENABLED}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                    title={lang === "ar" ? "تحليل معمق" : "Deep Dive Analysis"}
                  >
                    <Microscope size={22} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-50 flex gap-4 justify-end">
            <Button variant="secondary" onClick={() => handleExportPDF(selectedItem)}>
              <Download size={18} /> تحميل كملف PDF
            </Button>
            <Button variant="primary" className="bg-indigo-600">
              <Share2 size={18} /> مشاركة مع الفريق
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 text-right">
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <h2 className="text-5xl font-black mb-4 tracking-tight">{t.library}</h2>
        <p className="text-slate-500 text-xl font-bold leading-relaxed">
          المستودع الوطني للمعرفة: ابحث في مئات الوثائق القانونية والأدلة التدريبية المعتمدة.
        </p>

        <div className="relative group max-w-2xl mx-auto">
          <input
            className="w-full bg-white border-2 border-slate-100 rounded-[2.5rem] py-6 px-20 text-xl font-bold text-right outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-xl transition-all"
            placeholder={lang === "ar" ? "اسأل المكتبة عن أي شيء في الحوكمة..." : "Ask the Library anything about governance..."}
            value={aiSearchQuery}
            onChange={(e) => setAiSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askLibrary()}
          />
          <div className={`absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full ${isAiLoading ? "bg-indigo-100 animate-pulse" : "bg-indigo-600"} text-white`}>
            <Sparkles size={24} />
          </div>
          <button
            onClick={askLibrary}
            disabled={isAiLoading || !AI_ENABLED}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-slate-100 text-slate-600 px-6 py-2 rounded-2xl font-black text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {lang === "ar" ? "بحث ذكي" : "AI Search"}
          </button>
        </div>

        {aiSearchResponse && (
          <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-10 rounded-[3rem] shadow-2xl text-right animate-in slide-in-from-top-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-400 rounded-full blur-3xl" />
            </div>
            <div className="flex justify-between items-center mb-6 flex-row-reverse border-b border-white/20 pb-4">
              <h4 className="text-xl font-black flex items-center gap-3">
                <Bot size={24} /> {lang === "ar" ? "إجابة المساعد الذكي للمكتبة" : "Library AI Response"}
              </h4>
              <button onClick={() => setAiSearchResponse(null)} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="text-xl leading-relaxed font-bold whitespace-pre-line opacity-95">{aiSearchResponse}</div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {LIBRARY_DATA.map((item) => (
          <Card
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all h-full flex flex-col p-10 bg-white rounded-[2.5rem]"
          >
            <div className="flex justify-between items-start mb-8 flex-row-reverse">
              <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                <Library size={32} />
              </div>
              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg uppercase tracking-widest">
                {item.type}
              </span>
            </div>
            <h3 className="text-2xl font-black mb-4 text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
              {item.title[lang]}
            </h3>
            <p className="text-lg text-slate-500 flex-1 leading-relaxed font-bold">{item.description[lang]}</p>
            <div className="mt-10 flex items-center gap-3 text-indigo-600 font-black text-sm justify-end">
              {lang === "ar" ? "تصفح المرجع" : "Explore Resource"} <ChevronLeft size={16} className="mt-0.5" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- Settings View ---
const SettingsView: React.FC<{ lang: Language; setLang: (l: Language) => void }> = ({ lang, setLang }) => {
  const t = translations[lang];
  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right max-w-2xl mx-auto">
      <h2 className="text-3xl font-black">{t.settings}</h2>

      <Card className="p-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between flex-row-reverse">
            <div className="flex items-center gap-4 flex-row-reverse">
              <Globe className="text-indigo-600" />
              <div className="text-right">
                <h4 className="font-black text-slate-700">{t.language}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">App Interface Language</p>
              </div>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setLang("ar")}
                className={`px-6 py-2 rounded-lg font-black transition-all ${lang === "ar" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400"}`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-6 py-2 rounded-lg font-black transition-all ${lang === "en" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400"}`}
              >
                English
              </button>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-8">
            <div className="flex items-center gap-4 flex-row-reverse mb-6">
              <HardDrive className="text-slate-400" />
              <div className="text-right">
                <h4 className="font-black text-slate-700">تخزين البيانات</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Local Storage Management</p>
              </div>
            </div>

            <Button
              variant="danger"
              className="w-full"
              onClick={() => {
                if (window.confirm("هل أنت متأكد من مسح كافة البيانات المخزنة محلياً؟ لا يمكن التراجع عن هذا الإجراء.")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              <Trash size={18} /> مسح ذاكرة التخزين المؤقت
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [view, setView] = useState("home");
  const [lang, setLang] = useState<Language>(() => storage.get(STORAGE_KEYS.LANGUAGE, "ar"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    storage.set(STORAGE_KEYS.LANGUAGE, lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const navigationItems = [
    { id: "home", label: translations[lang].home, icon: Home },
    { id: "lessons", label: translations[lang].lessons, icon: BookOpen },
    { id: "toolkit", label: translations[lang].toolkit, icon: Wrench },
    { id: "meetings", label: translations[lang].meetings, icon: Users },
    { id: "feedback", label: translations[lang].feedback, icon: MessageSquare },
    { id: "library", label: translations[lang].library, icon: Library },
    { id: "settings", label: translations[lang].settings, icon: Settings },
  ];

  const renderContent = () => {
    switch (view) {
      case "home":
        return <HomeView onNavigate={setView} lang={lang} />;
      case "lessons":
        return <LessonsView lang={lang} />;
      case "toolkit":
        return <ToolkitView lang={lang} />;
      case "meetings":
        return <MeetingsView lang={lang} />;
      case "feedback":
        return <FeedbackView lang={lang} />;
      case "library":
        return <LibraryView lang={lang} />;
      case "settings":
        return <SettingsView lang={lang} setLang={setLang} />;
      default:
        return <HomeView onNavigate={setView} lang={lang} />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#f8fafc] flex font-['Cairo',sans-serif] ${lang === "ar" ? "rtl" : "ltr"}`}>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 z-50 w-80 bg-white border-x border-slate-100 transition-transform duration-300 transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : lang === "ar" ? "translate-x-full" : "-translate-x-full"
        } ${lang === "ar" ? "right-0" : "left-0"}`}
      >
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-12 flex-row-reverse">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <ShieldCheck size={28} />
            </div>
            <div className="text-right">
              <h1 className="text-xl font-black text-slate-900 leading-none">أكاديمية</h1>
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Auranitis Academy</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold flex-row-reverse ${
                  view === item.id ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                <item.icon size={22} />
                <span className="flex-1 text-right">{item.label}</span>
                {view === item.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-slate-50">
            <Card className="bg-indigo-50 border-none p-4 text-center">
              <p className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-1">الوضع الحالي</p>
              <div className="flex items-center justify-center gap-2 text-indigo-800 font-bold">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                متصل محلياً
              </div>
            </Card>
          </div>
        </div>
      </aside>

      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${lang === "ar" ? "lg:mr-80" : "lg:ml-80"}`}>
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center px-8">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500">
            <Menu />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-black text-slate-900">مرحباً بك، مواطن سوري</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مستوى التعلم: مبتدئ</span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-white shadow-sm overflow-hidden">
              <Users size={20} />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">{renderContent()}</div>

        <footer className="mt-auto border-t border-slate-100 py-10 px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 flex-row-reverse">
            <div className="flex items-center gap-3 opacity-30 flex-row-reverse">
              <ShieldCheck />
              <span className="font-black text-xs uppercase tracking-widest">Auranitis Academy for Civic Governance</span>
            </div>
            <div className="flex gap-8 text-xs font-black text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-indigo-600 transition-colors">
                اتصل بنا
              </a>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                سياسة الخصوصية
              </a>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                الأمان الرقمي
              </a>
            </div>
          </div>
        </footer>
      </main>

      <AIChatWidget lang={lang} />
    </div>
  );
};

export default App;

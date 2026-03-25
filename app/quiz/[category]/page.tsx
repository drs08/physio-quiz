"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { categoryConfig, type Question } from "@/data/questions";

type Stage = "intro" | "quiz" | "results";
type Answer = number | null;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcScore(answers: Answer[], questions: Question[]) {
  let correct = 0, wrong = 0, skipped = 0;
  answers.forEach((a, i) => {
    if (a === null) skipped++;
    else if (a === questions[i].correctIndex) correct++;
    else wrong++;
  });
  const raw = correct - wrong * 0.25;
  const pct = questions.length > 0 ? Math.max(0, (raw / questions.length) * 100) : 0;
  return { correct, wrong, skipped, raw, pct };
}

function getMsg(pct: number): { emoji: string; title: string; body: string } {
  if (pct >= 90) return { emoji: "🏆", title: "Outstanding, Hetvi!", body: "You're absolutely crushing it! The exam doesn't stand a chance. Keep shining! 🔥" };
  if (pct >= 75) return { emoji: "🌟", title: "Brilliant, Hetvi!", body: "You're on fire! Keep this momentum going and the job is yours! ✨" };
  if (pct >= 60) return { emoji: "😊", title: "Good Job, Hetvi!", body: "Solid performance! A little more practice and you'll be unstoppable! 💪" };
  if (pct >= 40) return { emoji: "🤔", title: "Keep Going, Hetvi!", body: "You can definitely do better! Review the wrong answers and try again! 📚" };
  return { emoji: "💙", title: "Chin Up, Hetvi!", body: "Come on — you can do SO much better than this! Don't give up, every attempt counts! 🌸" };
}

const QUIZ_COUNT = 30;
const LABELS = ["A", "B", "C", "D"];

const CARD_META: Record<string, { msIcon: string; iconBg: string; iconColor: string }> = {
  reasoning: { msIcon: "psychology",       iconBg: "bg-violet-50",  iconColor: "text-violet-600" },
  aptitude:  { msIcon: "calculate",        iconBg: "bg-blue-50",    iconColor: "text-blue-600"   },
  gk:        { msIcon: "public",           iconBg: "bg-emerald-50", iconColor: "text-emerald-600"},
  physio:    { msIcon: "health_and_safety",iconBg: "bg-rose-50",    iconColor: "text-rose-500"   },
};

/* ── Confetti ── */
function Confetti() {
  const colors = ["#4a40e0", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa"];
  return (
    <>
      {Array.from({ length: 48 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-12px",
            background: colors[i % colors.length],
            width: `${6 + Math.random() * 7}px`,
            height: `${6 + Math.random() * 7}px`,
            borderRadius: Math.random() > 0.4 ? "50%" : "3px",
            animationDelay: `${Math.random() * 1.8}s`,
            animationDuration: `${2.2 + Math.random() * 1.8}s`,
          }}
        />
      ))}
    </>
  );
}

/* ── Main ── */
export default function QuizPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const cfg = categoryConfig[category as keyof typeof categoryConfig];
  const meta = CARD_META[category] ?? CARD_META.physio;

  const [stage, setStage] = useState<Stage>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [reviewOpen, setReviewOpen] = useState<number | null>(null);

  useEffect(() => {
    if (cfg && !cfg.comingSoon) {
      setQuestions(shuffle(cfg.questions).slice(0, Math.min(QUIZ_COUNT, cfg.questions.length)));
    }
  }, [cfg]);

  if (!cfg || cfg.comingSoon) {
    return (
      <main className="min-h-screen bg-[#f5f7f9] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-[2rem] bg-[#eef1f3] flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-[#747779]" style={{ fontSize: "40px" }}>
            construction
          </span>
        </div>
        <h1 className="font-headline text-xl font-extrabold text-[#2c2f31] mb-2">Coming Soon!</h1>
        <p className="text-[#747779] text-sm mb-7 leading-relaxed">
          This section is being prepared for you, Hetvi!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#4a40e0] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-indigo-200"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
          Back to Home
        </Link>
      </main>
    );
  }

  const startQuiz = () => {
    const fresh = shuffle(cfg.questions).slice(0, Math.min(QUIZ_COUNT, cfg.questions.length));
    setQuestions(fresh);
    setAnswers(new Array(fresh.length).fill(null));
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setConfetti(false);
    setReviewOpen(null);
    setStage("quiz");
  };

  const handlePick = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const na = [...answers];
    na[current] = idx;
    setAnswers(na);
  };

  const handleSkip = () => {
    if (revealed) return;
    const na = [...answers];
    na[current] = null;
    setAnswers(na);
    advance(na);
  };

  const advance = (ans = answers) => {
    if (current + 1 >= questions.length) finish(ans);
    else {
      setCurrent(c => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const finish = (ans: Answer[]) => {
    const { pct } = calcScore(ans, questions);
    if (pct >= 60) setConfetti(true);
    setAnswers(ans);
    setStage("results");
  };

  const progress = questions.length > 0 ? (current / questions.length) * 100 : 0;
  const score = calcScore(answers, questions);
  const msg = getMsg(score.pct);

  /* ════════════ INTRO ════════════ */
  if (stage === "intro") {
    return (
      <main className="min-h-screen bg-[#f5f7f9] flex flex-col">
        {/* Header */}
        <div className={`relative overflow-hidden bg-gradient-to-br ${cfg.color} px-5 pt-14 pb-8`}>
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <Link
            href="/"
            className="relative z-10 inline-flex items-center gap-1.5 text-white/70 text-sm mb-6 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
            Home
          </Link>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
              <span className="text-3xl">{cfg.icon}</span>
            </div>
            <div>
              <h1 className="font-headline text-2xl font-extrabold text-white">{cfg.title}</h1>
              <p className="text-white/65 text-[12px] mt-0.5">{cfg.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-5 flex flex-col gap-3">
          {/* How it works */}
          <div className="bg-white rounded-3xl shadow-sm p-5 anim-slide-up">
            <h2 className="font-headline text-[11px] font-bold text-[#747779] uppercase tracking-widest mb-4">
              How It Works
            </h2>
            <div className="space-y-3.5">
              {[
                { msIcon: "help", color: "text-[#4a40e0]", bg: "bg-indigo-50", text: <><strong className="text-[#2c2f31]">{Math.min(QUIZ_COUNT, questions.length)} questions</strong> selected randomly each time</> },
                { msIcon: "check_circle", color: "text-emerald-600", bg: "bg-emerald-50", text: <><strong className="text-emerald-700">+1 mark</strong> for every correct answer</> },
                { msIcon: "cancel", color: "text-rose-500", bg: "bg-rose-50", text: <><strong className="text-rose-600">−¼ mark</strong> deducted for each wrong answer</> },
                { msIcon: "skip_next", color: "text-[#747779]", bg: "bg-[#eef1f3]", text: <><strong className="text-[#2c2f31]">Skip</strong> if unsure — no penalty for skipping</> },
                { msIcon: "lightbulb", color: "text-amber-600", bg: "bg-amber-50", text: <>Tap any option to instantly reveal the answer &amp; explanation</> },
              ].map((row, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl ${row.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <span className={`material-symbols-outlined ${row.color}`} style={{ fontSize: "18px" }}>
                      {row.msIcon}
                    </span>
                  </div>
                  <p className="text-sm text-[#595c5e] leading-snug pt-1.5">{row.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section weight chip */}
          <div className={`${cfg.bgLight} border ${cfg.borderColor} rounded-2xl px-4 py-3.5 flex items-center justify-between anim-slide-up anim-delay-1`}>
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined ${cfg.textColor}`} style={{ fontSize: "18px" }}>
                military_tech
              </span>
              <span className={`text-sm font-semibold ${cfg.textColor}`}>Section weight in real exam</span>
            </div>
            <span className={`font-headline text-base font-extrabold ${cfg.textColor}`}>
              {cfg.totalMarks} marks
            </span>
          </div>

          <div className="flex-1" />

          {/* Start CTA */}
          <button
            onClick={startQuiz}
            className={`w-full bg-gradient-to-r ${cfg.color} text-white py-4 rounded-2xl font-headline font-bold text-base shadow-lg active:scale-[0.97] transition-transform anim-slide-up anim-delay-2`}
          >
            Start Quiz {cfg.icon}
          </button>
          <div className="pb-4" />
        </div>
      </main>
    );
  }

  /* ════════════ QUIZ ════════════ */
  if (stage === "quiz") {
    const q = questions[current];

    return (
      <main className="min-h-screen bg-[#f5f7f9] flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${cfg.color} px-4 pt-14 pb-5 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setStage("intro")}
              className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-white" style={{ fontSize: "18px" }}>close</span>
            </button>

            <div className="text-center">
              <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider">Question</p>
              <p className="font-headline font-extrabold text-white text-lg leading-none mt-0.5">
                {current + 1}
                <span className="text-white/50 font-normal text-sm">/{questions.length}</span>
              </p>
            </div>

            <div className={`w-9 h-9 rounded-2xl ${meta.iconBg} flex items-center justify-center`}>
              <span className={`material-symbols-outlined ${meta.iconColor}`} style={{ fontSize: "20px" }}>
                {meta.msIcon}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 px-4 py-4 flex flex-col gap-3 overflow-y-auto">
          {/* Question card */}
          <div key={`q-${current}`} className="bg-white rounded-3xl shadow-sm p-5 anim-slide-up">
            <span className={`text-[10px] font-bold ${cfg.textColor} uppercase tracking-widest font-headline`}>
              Q {current + 1} of {questions.length}
            </span>
            <p className="mt-2.5 text-[#2c2f31] font-semibold text-[15px] leading-relaxed">
              {q.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5" key={`opts-${current}`}>
            {q.options.map((opt, idx) => {
              const isCorrect = idx === q.correctIndex;
              const isChosen  = selected === idx;

              let containerCls = "bg-white border-2 border-[#e8eaed]";
              let labelCls     = "bg-[#f0f2f4] text-[#747779]";
              let textCls      = "text-[#2c2f31]";
              let iconEl: React.ReactNode = null;

              if (revealed) {
                if (isCorrect) {
                  containerCls = "bg-emerald-50 border-2 border-emerald-300";
                  labelCls     = "bg-emerald-500 text-white";
                  textCls      = "text-emerald-800";
                  iconEl = (
                    <span className="material-symbols-outlined text-emerald-500 shrink-0" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  );
                } else if (isChosen) {
                  containerCls = "bg-rose-50 border-2 border-rose-300";
                  labelCls     = "bg-rose-500 text-white";
                  textCls      = "text-rose-700";
                  iconEl = (
                    <span className="material-symbols-outlined text-rose-400 shrink-0" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>
                      cancel
                    </span>
                  );
                } else {
                  containerCls = "bg-white border-2 border-[#e8eaed] opacity-50";
                  labelCls     = "bg-[#f0f2f4] text-[#abadaf]";
                  textCls      = "text-[#abadaf]";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handlePick(idx)}
                  disabled={revealed}
                  className={`anim-slide-up anim-delay-${Math.min(idx + 1, 5)} w-full text-left rounded-2xl px-3.5 py-3.5 flex items-center gap-3 transition-all duration-200 ${containerCls} ${
                    !revealed ? "active:scale-[0.97] cursor-pointer hover:border-[#4a40e0]/30" : ""
                  }`}
                >
                  <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-headline ${labelCls}`}>
                    {LABELS[idx]}
                  </span>
                  <span className={`font-medium text-sm leading-snug flex-1 ${textCls}`}>{opt}</span>
                  {iconEl}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {revealed && q.explanation && (
            <div className={`${cfg.bgLight} border ${cfg.borderColor} rounded-2xl px-4 py-4 anim-slide-up`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-amber-500" style={{ fontSize: "18px" }}>
                  lightbulb
                </span>
                <p className={`text-[11px] font-bold ${cfg.textColor} uppercase tracking-widest font-headline`}>
                  Explanation
                </p>
              </div>
              <p className="text-sm text-[#595c5e] leading-relaxed">{q.explanation}</p>
            </div>
          )}

          {/* Action button */}
          <div className="pt-1 pb-6">
            {!revealed ? (
              <button
                onClick={handleSkip}
                className="w-full border-2 border-[#e8eaed] bg-white text-[#747779] py-4 rounded-2xl font-bold text-sm active:scale-[0.97] transition-transform hover:border-[#abadaf]"
              >
                Skip this question
              </button>
            ) : (
              <button
                onClick={() => advance()}
                className={`w-full bg-gradient-to-r ${cfg.color} text-white py-4 rounded-2xl font-headline font-bold text-base shadow-sm active:scale-[0.97] transition-transform`}
              >
                {current + 1 >= questions.length ? "See My Results 🏁" : "Next Question →"}
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  /* ════════════ RESULTS ════════════ */
  return (
    <main className="min-h-screen bg-[#f5f7f9] flex flex-col">
      {confetti && <Confetti />}

      {/* Result hero */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${cfg.color} px-5 pt-16 pb-10 text-center`}>
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="anim-pop-in text-5xl mb-3">{msg.emoji}</div>
        <h1 className="font-headline text-2xl font-extrabold text-white anim-slide-up">{msg.title}</h1>
        <p className="text-white/75 text-sm mt-2 leading-relaxed px-6 anim-slide-up anim-delay-1">
          {msg.body}
        </p>
      </div>

      <div className="flex-1 px-4 py-5 space-y-4 overflow-y-auto pb-10">
        {/* Score ring */}
        <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col items-center anim-slide-up">
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" stroke="#f0f2f4" strokeWidth="10" fill="none" />
              <circle
                cx="60" cy="60" r="52"
                stroke="url(#scoreGrad)"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - Math.min(score.pct, 100) / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4a40e0" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline text-2xl font-extrabold text-[#2c2f31]">
                {score.pct.toFixed(0)}%
              </span>
              <span className="text-[10px] text-[#747779] font-semibold uppercase tracking-wider">Score</span>
            </div>
          </div>
          <p className="font-headline font-extrabold text-[#2c2f31] text-base">
            {score.raw.toFixed(2)}{" "}
            <span className="text-[#747779] font-normal text-sm">/ {questions.length} marks</span>
          </p>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-3 gap-2.5 anim-slide-up anim-delay-1">
          {[
            { label: "Correct", val: score.correct, msIcon: "check_circle", iconStyle: { fontVariationSettings: "'FILL' 1" }, bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", iconColor: "text-emerald-500" },
            { label: "Wrong",   val: score.wrong,   msIcon: "cancel",        iconStyle: { fontVariationSettings: "'FILL' 1" }, bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-500",    iconColor: "text-rose-400"    },
            { label: "Skipped", val: score.skipped, msIcon: "skip_next",     iconStyle: {}, bg: "bg-[#f0f2f4]",  border: "border-[#e8eaed]",  text: "text-[#595c5e]",  iconColor: "text-[#747779]"  },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-3.5 text-center`}>
              <span className={`material-symbols-outlined ${s.iconColor} mb-1`} style={{ fontSize: "22px", ...s.iconStyle }}>
                {s.msIcon}
              </span>
              <p className={`font-headline text-2xl font-extrabold ${s.text}`}>{s.val}</p>
              <p className="text-[10px] text-[#747779] font-semibold mt-0.5 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Answer Review */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden anim-slide-up anim-delay-2">
          <div className="px-5 py-4 border-b border-[#f0f2f4] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4a40e0]" style={{ fontSize: "20px" }}>rate_review</span>
            <h2 className="font-headline font-bold text-[#2c2f31] text-sm">Answer Review</h2>
          </div>
          <div className="divide-y divide-[#f5f7f9]">
            {questions.map((q, i) => {
              const ans = answers[i];
              const correct = ans === q.correctIndex;
              const skipped = ans === null;
              const open = reviewOpen === i;

              return (
                <button
                  key={q.id}
                  onClick={() => setReviewOpen(open ? null : i)}
                  className="w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-[#f5f7f9] transition-colors active:bg-[#f0f2f4]"
                >
                  <div className={`shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${
                    skipped
                      ? "bg-[#e8eaed]"
                      : correct
                      ? "bg-emerald-500"
                      : "bg-rose-500"
                  }`}>
                    <span className="material-symbols-outlined text-white" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>
                      {skipped ? "remove" : correct ? "check" : "close"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#595c5e] font-medium leading-snug line-clamp-2">
                      {q.question}
                    </p>
                    {open && (
                      <div className="mt-2.5 space-y-1.5 anim-slide-up">
                        {!skipped && !correct && (
                          <p className="text-xs text-rose-500">
                            Your answer: <span className="font-semibold">{q.options[ans!]}</span>
                          </p>
                        )}
                        <p className="text-xs text-emerald-600">
                          Correct: <span className="font-semibold">{q.options[q.correctIndex]}</span>
                        </p>
                        {q.explanation && (
                          <p className="text-xs text-[#747779] leading-relaxed">{q.explanation}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <span
                    className={`material-symbols-outlined shrink-0 text-[#abadaf] mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    style={{ fontSize: "18px" }}
                  >
                    expand_more
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 anim-slide-up anim-delay-3">
          <button
            onClick={startQuiz}
            className={`w-full bg-gradient-to-r ${cfg.color} text-white py-4 rounded-2xl font-headline font-bold text-base shadow-sm active:scale-[0.97] transition-transform`}
          >
            Try Again with New Questions 🔄
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-white border-2 border-[#e8eaed] text-[#595c5e] py-3.5 rounded-2xl font-bold text-sm active:scale-[0.97] transition-transform hover:border-[#abadaf]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
            Back to Home
          </Link>
        </div>
        <div className="pb-2" />
      </div>
    </main>
  );
}

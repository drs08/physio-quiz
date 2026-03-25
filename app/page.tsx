"use client";

import Link from "next/link";
import { categoryConfig } from "@/data/questions";

const examRows = [
  {
    label: "Physiotherapy",
    subtitle: "Core Domain",
    marks: 120,
    msIcon: "medical_services",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    label: "Logical Reasoning",
    subtitle: "Logical Analysis",
    marks: 30,
    msIcon: "psychology",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    label: "Quantitative Aptitude",
    subtitle: "Quantitative Math",
    marks: 30,
    msIcon: "calculate",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Constitution & GK",
    subtitle: "General Awareness",
    marks: 30,
    msIcon: "public",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

const CARD_META: Record<string, {
  msIcon: string;
  iconBg: string;
  iconColor: string;
  shadowColor: string;
}> = {
  reasoning: {
    msIcon: "psychology",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    shadowColor: "hover:shadow-violet-100",
  },
  aptitude: {
    msIcon: "calculate",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    shadowColor: "hover:shadow-blue-100",
  },
  gk: {
    msIcon: "public",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    shadowColor: "hover:shadow-emerald-100",
  },
  physio: {
    msIcon: "health_and_safety",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    shadowColor: "hover:shadow-rose-100",
  },
};

export default function HomePage() {
  const entries = Object.entries(categoryConfig) as [
    keyof typeof categoryConfig,
    (typeof categoryConfig)[keyof typeof categoryConfig]
  ][];

  return (
    <div className="bg-[#f5f7f9] min-h-screen">
      {/* ── Top App Bar ── */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100/80 shadow-sm">
        <div className="flex items-center justify-between px-5 h-16 max-w-2xl mx-auto">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors active:scale-90 duration-200">
            <span className="material-symbols-outlined text-[#4a40e0]" style={{ fontSize: "22px" }}>
              menu
            </span>
          </div>
          <h1 className="font-headline font-extrabold text-[#4a40e0] tracking-tight text-lg">
            PhysioPrep
          </h1>
          <div className="w-9 h-9 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold text-sm font-headline">
            H
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="pt-20 pb-10 px-4 max-w-2xl mx-auto space-y-6">

        {/* Hero Greeting */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#4a40e0] to-[#7c3aed] p-7 shadow-xl shadow-indigo-200/60 anim-slide-up">
          <div className="absolute -top-12 -right-12 w-52 h-52 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <span className="font-headline text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold mb-2 block">
              Welcome Back
            </span>
            <h2 className="font-headline text-[30px] font-extrabold text-white mb-5 leading-tight">
              Hey Hetvi! 👋
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-300" style={{ fontSize: "20px" }}>
                  check_circle
                </span>
                <p className="text-white text-sm font-semibold">+1 Mark for Correct Answer</p>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-rose-300" style={{ fontSize: "20px" }}>
                  cancel
                </span>
                <p className="text-white text-sm font-semibold">−¼ Mark for Wrong Answer</p>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-300" style={{ fontSize: "20px" }}>
                  skip_next
                </span>
                <p className="text-white text-sm font-semibold">0 Marks for Skipped</p>
              </div>
            </div>
          </div>
        </section>

        {/* Exam Pattern */}
        <section className="space-y-3 anim-slide-up anim-delay-1">
          <div className="flex items-end justify-between px-1">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#747779] block mb-0.5">
                Curriculum
              </span>
              <h3 className="font-headline text-xl font-extrabold text-[#2c2f31]">Exam Pattern</h3>
            </div>
            <span className="text-xs font-bold text-[#4a40e0] bg-indigo-50 px-3 py-1 rounded-full">
              210 Marks
            </span>
          </div>

          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            {examRows.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-4 py-3.5 hover:bg-[#f5f7f9] transition-colors ${
                  i < examRows.length - 1 ? "border-b border-[#f0f2f4]" : ""
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl ${row.iconBg} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined ${row.iconColor}`} style={{ fontSize: "22px" }}>
                      {row.msIcon}
                    </span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-[#2c2f31] text-[13px]">{row.label}</p>
                    <p className="text-[11px] text-[#747779]">{row.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-headline font-extrabold text-[#2c2f31] text-[17px]">{row.marks}</p>
                  <p className="text-[9px] uppercase font-bold text-[#747779] tracking-tight">marks</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Practice Sections */}
        <section className="space-y-4 anim-slide-up anim-delay-2">
          <div className="flex items-center gap-2.5 px-1">
            <div className="h-7 w-1 bg-[#4a40e0] rounded-full" />
            <h3 className="font-headline text-xl font-extrabold text-[#2c2f31]">Practice Sections</h3>
          </div>

          <div className="flex flex-col gap-6">
            {entries.map(([key, cfg]) => {
              const meta = CARD_META[key] ?? CARD_META.physio;
              const card = (
                <div
                  className={`group relative overflow-hidden bg-white rounded-[2rem] shadow-md transition-all duration-300 ${
                    cfg.comingSoon
                      ? "opacity-70"
                      : `hover:shadow-xl ${meta.shadowColor} active:scale-[0.98] cursor-pointer`
                  }`}
                >
                  {/* Watermark icon */}
                  <div className="absolute -right-3 -bottom-3 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity pointer-events-none select-none">
                    <span
                      className={`material-symbols-outlined ${meta.iconColor}`}
                      style={{
                        fontSize: "110px",
                        fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                      }}
                    >
                      {meta.msIcon}
                    </span>
                  </div>

                  <div className="relative z-10 p-7 space-y-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl ${meta.iconBg} flex items-center justify-center`}>
                      <span
                        className={`material-symbols-outlined ${meta.iconColor}`}
                        style={{ fontSize: "28px" }}
                      >
                        {meta.msIcon}
                      </span>
                    </div>

                    {/* Title + subtitle */}
                    <div>
                      <h4 className="font-headline text-[17px] font-extrabold text-[#2c2f31] leading-tight">
                        {cfg.title}
                      </h4>
                      <p className="text-[13px] text-[#747779] mt-1">
                        {cfg.comingSoon ? cfg.totalMarks : 30} questions · {cfg.totalMarks} marks
                      </p>
                    </div>

                    {/* CTA button */}
                    {cfg.comingSoon ? (
                      <div className="inline-flex items-center gap-2 bg-[#eef1f3] text-[#747779] px-5 py-2.5 rounded-full text-sm font-bold cursor-not-allowed">
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                          schedule
                        </span>
                        Coming Soon
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-[#4a40e0] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-200">
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                          play_arrow
                        </span>
                        Start Practice
                      </div>
                    )}
                  </div>
                </div>
              );

              return cfg.comingSoon ? (
                <div key={key}>{card}</div>
              ) : (
                <Link key={key} href={`/quiz/${key}`}>
                  {card}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Motivational footer */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-[2rem] p-5 text-center anim-slide-up anim-delay-3">
          <p className="font-headline text-white font-extrabold text-[15px] leading-snug">
            ✨ Every question you practice brings you closer!
          </p>
          <p className="text-white/80 text-xs mt-1.5">You&apos;ve got this, Hetvi 💪</p>
        </div>

      </main>

    </div>
  );
}

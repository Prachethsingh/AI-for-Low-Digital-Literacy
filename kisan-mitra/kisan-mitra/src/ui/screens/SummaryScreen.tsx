import React from "react";
import type { Answers } from "../App";
import type { Lang, Scheme } from "../../domain/schemes";

function humanVal(v: string | boolean | undefined): string {
  if (v === undefined || v === null) return "—";
  if (typeof v === "boolean") return v ? "✅ Yes" : "❌ No";
  if (v === "skipped") return "⏭ Skipped";
  if (v.startsWith("data:image/")) return "📷 Photo captured";
  return v;
}

export default function SummaryScreen({
  lang, scheme, answers, onBack, onConfirm,
}: {
  lang: Lang; scheme: Scheme; answers: Answers;
  onBack: () => void; onConfirm: () => void;
}) {
  const kn = lang === "kn";

  const rows = scheme.questions.map((q) => ({
    id: q.id,
    question: kn ? q.kn : q.en,
    value: humanVal(answers[q.id] as any),
  }));

  return (
    <div className="screen">
      <div className="back-row">
        <button className="back-btn" onClick={onBack}>← {kn ? "ತಿದ್ದು" : "Edit"}</button>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 42 }}>{scheme.icon}</span>
        <div>
          <div className="h2">{kn ? "ನಿಮ್ಮ ಮಾಹಿತಿ" : "Your Information"}</div>
          <p className="muted mt4">{kn ? "ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ದೃಢಪಡಿಸಿ" : "Review and confirm your details"}</p>
        </div>
      </div>

      {/* Summary table */}
      <div className="card">
        <div className="card-body">
          {rows.map((r) => (
            <div key={r.id} className="summary-row">
              <div className="sr-q">{r.question}</div>
              <div className="sr-v">{r.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheme info chip */}
      <div style={{ display: "flex" }}>
        <span style={{
          background: scheme.bg, border: `1.5px solid ${scheme.color}`,
          color: scheme.color, borderRadius: 999, padding: "6px 16px",
          fontWeight: 800, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          {scheme.icon} {kn ? scheme.kn : scheme.en}
        </span>
      </div>

      {/* Buttons */}
      <button className="btn btn-green" onClick={onConfirm}>
        ✅ {kn ? "ಸರಿ, ಮುಂದೆ ಹೋಗಿ" : "Confirm & Continue"}
      </button>
      <button className="btn btn-ghost" onClick={onBack}>
        ✏️ {kn ? "ತಿದ್ದಿಕೊಳ್ಳಿ" : "Edit Answers"}
      </button>
    </div>
  );
}

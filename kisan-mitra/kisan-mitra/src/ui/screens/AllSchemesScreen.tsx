import React, { useState } from "react";
import type { Lang } from "../../domain/schemes";
import { SCHEMES } from "../../domain/schemes";
import type { SpeechApi } from "../speech/useSpeech";

const CATEGORIES = [
  { id: "all",    icon: "🌐", kn: "ಎಲ್ಲ",      en: "All" },
  { id: "farmer", icon: "🌾", kn: "ರೈತ",       en: "Farmer" },
  { id: "money",  icon: "💰", kn: "ಹಣ",        en: "Money" },
  { id: "women",  icon: "👩", kn: "ಮಹಿಳಾ",    en: "Women" },
];

export default function AllSchemesScreen({
  lang, speech, onPick,
}: {
  lang: Lang; speech: SpeechApi; onPick: (id: string) => void;
}) {
  const kn = lang === "kn";
  const [cat, setCat] = useState("all");

  const filtered = SCHEMES.filter((s) => {
    if (cat === "all")    return true;
    if (cat === "farmer") return s.requiresFarmer;
    if (cat === "women")  return s.forWomen;
    if (cat === "money")  return !s.requiresFarmer && !s.forWomen;
    return true;
  });

  return (
    <div className="screen">
      <div className="h2">{kn ? "ಎಲ್ಲ ಯೋಜನೆಗಳು" : "All Schemes"}</div>
      <p className="muted mt4">
        {kn ? "ಯೋಜನೆ ಆಯ್ಕೆ ಮಾಡಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ" : "Choose a scheme to learn more and apply"}
      </p>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            style={{
              flexShrink: 0,
              padding: "8px 14px",
              borderRadius: 999,
              border: "1.5px solid",
              borderColor: cat === c.id ? "var(--leaf)" : "rgba(61,43,31,0.18)",
              background: cat === c.id ? "var(--leaf)" : "var(--parchment)",
              color: cat === c.id ? "#fff" : "var(--soil)",
              fontWeight: 800,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            {c.icon} {kn ? c.kn : c.en}
          </button>
        ))}
      </div>

      <div className="scheme-list">
        {filtered.map((s) => (
          <button key={s.id} className="scheme-card" onClick={() => onPick(s.id)}>
            <div className="sc-stripe" style={{ background: s.color }} />
            <div className="sc-icon-box" style={{ background: s.bg }}>
              <span className="sc-icon">{s.icon}</span>
            </div>
            <div className="sc-body">
              <div className="sc-name">{kn ? s.kn : s.en}</div>
              <div className="sc-tag">{kn ? s.tagKn : s.tagEn}</div>
            </div>
            <div className="sc-arrow">›</div>
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import type { Lang, Scheme } from "../../domain/schemes";
import type { SpeechApi } from "../speech/useSpeech";
import { logEvent } from "../../lib/supabase";

export default function SchemeDetailScreen({
  lang, scheme, speech, onApply, onBack,
}: {
  lang: Lang; scheme: Scheme; speech: SpeechApi;
  onApply: () => void; onBack: () => void;
}) {
  const kn = lang === "kn";
  const name = kn ? scheme.kn : scheme.en;
  const desc = kn ? scheme.descKn : scheme.descEn;

  useEffect(() => {
    speech.speak(`${name}. ${kn ? scheme.tagKn : scheme.tagEn}. ${desc}`);
    logEvent("view_scheme", { schemeId: scheme.id, schemeName: scheme.en });
  }, [scheme.id, lang]);

  return (
    <div className="screen">
      <div className="back-row">
        <button className="back-btn" onClick={onBack}>← {kn ? "ಹಿಂದೆ" : "Back"}</button>
      </div>

      {/* Hero */}
      <div className="detail-hero" style={{ background: scheme.bg, borderLeft: `6px solid ${scheme.color}` }}>
        <span className="detail-icon">{scheme.icon}</span>
        <div className="detail-name" style={{ color: scheme.color }}>{name}</div>
        <div className="detail-tag" style={{ color: scheme.color }}>{kn ? scheme.tagKn : scheme.tagEn}</div>
      </div>

      {/* Audio button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className={"listen-btn " + (speech.speaking ? "speaking" : "")}
          onClick={() => speech.speaking ? speech.stop() : speech.speak(`${name}. ${desc}`)}
        >
          {speech.speaking ? "⏹ " : "🔊 "}
          {speech.speaking
            ? (kn ? "ನಿಲ್ಲಿಸಿ" : "Stop")
            : (kn ? "ವಿವರಣೆ ಕೇಳಿ" : "Listen")}
        </button>
      </div>

      {/* Description */}
      <div className="card">
        <div className="card-body">
          <p className="detail-desc">{desc}</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="card">
        <div className="card-body">
          <div className="h3 mb8">{kn ? "ಏನು ಸಿಗುತ್ತದೆ:" : "Benefits:"}</div>
          {scheme.benefits.map((b, i) => (
            <div key={i} className="benefit-row">
              <span className="benefit-icon">{b.icon}</span>
              <span className="benefit-text">{kn ? b.kn : b.en}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chips */}
      <div className="chip-row">
        <span className="chip" style={{
          background: scheme.requiresFarmer ? "#edfbf1" : "#eff6ff",
          borderColor: scheme.requiresFarmer ? "#2d7a3a" : "#1e3a8a",
          color: scheme.requiresFarmer ? "#2d7a3a" : "#1e3a8a",
        }}>
          {scheme.requiresFarmer
            ? (kn ? "✅ ರೈತರಿಗೆ" : "✅ Farmers")
            : (kn ? "✅ ಎಲ್ಲರಿಗೂ" : "✅ Everyone")}
        </span>
        <span className="chip" style={{
          background: "#fffbeb", borderColor: "#d97706", color: "#92400e",
        }}>
          {scheme.requiresAadhaar
            ? (kn ? "🪪 ಆಧಾರ್ ಬೇಕು" : "🪪 Aadhaar needed")
            : (kn ? "✅ ಆಧಾರ್ ಐಚ್ಛಿಕ" : "✅ Aadhaar optional")}
        </span>
        {scheme.forWomen && (
          <span className="chip" style={{ background: "#fdf2f8", borderColor: "#be185d", color: "#be185d" }}>
            {kn ? "👩 ಮಹಿಳೆಯರಿಗೆ" : "👩 Women only"}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <button className="btn btn-green" onClick={onApply}>
        📝 {kn ? "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ" : "Apply Now"}
      </button>

      <button
        className="btn btn-sky"
        onClick={() => window.open(`tel:${scheme.helpline}`)}
      >
        📞 {kn ? "ಸಹಾಯ ಸಾಲು" : "Call Helpline"} — {scheme.helpline}
      </button>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import type { Lang, Scheme } from "../../domain/schemes";
import type { SpeechApi } from "../speech/useSpeech";
import { logApplication } from "../../lib/supabase";

function downloadTxt(scheme: Scheme, lang: Lang) {
  const kn = lang === "kn";
  const name = kn ? scheme.kn : scheme.en;
  const content = [
    `=== ${kn ? "ಕಿಸಾನ್ ಮಿತ್ರ — ಅರ್ಜಿ ರಸೀದಿ" : "Kisan Mitra — Application Receipt"} ===`,
    "",
    `${kn ? "ಯೋಜನೆ" : "Scheme"}: ${name}`,
    `${kn ? "ಸಹಾಯ ಸಾಲು" : "Helpline"}: ${scheme.helpline}`,
    `${kn ? "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್" : "Official Website"}: ${scheme.applyUrl}`,
    "",
    kn
      ? "ಮುಂದಿನ ಹಂತ: ಮೇಲಿನ ಸಹಾಯ ಸಾಲು ಅಥವಾ ವೆಬ್‌ಸೈಟ್ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ."
      : "Next step: Apply through the helpline or official website above.",
    "",
    `Generated: ${new Date().toLocaleString("en-IN")}`,
  ].join("\n");

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  a.download = `kisan-mitra-${scheme.id}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

export default function DoneScreen({
  lang, scheme, speech, onHome,
}: {
  lang: Lang; scheme: Scheme; speech: SpeechApi; onHome: () => void;
}) {
  const kn = lang === "kn";
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    speech.speak(
      kn
        ? `ಅಭಿನಂದನೆ! ನಿಮ್ಮ ಅರ್ಜಿ ಸಿದ್ಧವಾಗಿದೆ. ${kn ? scheme.kn : scheme.en} ಯೋಜನೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.`
        : `Congratulations! Your application for ${scheme.en} is ready.`
    );
    if (!submitted) {
      logApplication(scheme.id, scheme.en);
      setSubmitted(true);
    }
  }, [lang, submitted]);

  return (
    <div className="screen">
      {/* Success hero */}
      <div className="done-hero">
        <div className="done-checkmark">✅</div>
        <div className="h1 center" style={{ color: "var(--leaf)" }}>
          {kn ? "ಸಿದ್ಧವಾಗಿದೆ!" : "All Done!"}
        </div>
        <p className="muted center">
          {kn
            ? "ನಿಮ್ಮ ಮಾಹಿತಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ. ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ."
            : "Your details are ready. Submit your application now."}
        </p>
      </div>

      {/* Scheme card */}
      <div className="card" style={{ borderTop: `5px solid ${scheme.color}` }}>
        <div className="card-body">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 44 }}>{scheme.icon}</span>
            <div>
              <div className="h3">{kn ? scheme.kn : scheme.en}</div>
              <p className="muted mt4">{kn ? scheme.tagKn : scheme.tagEn}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="card">
        <div className="card-body">
          <div className="h3" style={{ marginBottom: 12 }}>
            {kn ? "ಮುಂದಿನ ಹಂತಗಳು:" : "Next Steps:"}
          </div>
          {[
            { icon: "📞", kn: `${scheme.helpline} ಗೆ ಕರೆ ಮಾಡಿ`, en: `Call ${scheme.helpline}` },
            { icon: "🌐", kn: "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ ಭೇಟಿ ಮಾಡಿ", en: "Visit official website" },
            { icon: "📋", kn: "ಸ್ಥಳೀಯ ಕಚೇರಿಗೆ ಹೋಗಿ", en: "Visit local govt office" },
          ].map((step, i) => (
            <div key={i} className="benefit-row">
              <span className="benefit-icon">{step.icon}</span>
              <span className="benefit-text">{kn ? step.kn : step.en}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <button
        className="btn btn-green"
        onClick={() => window.open(scheme.applyUrl, "_blank")}
      >
        🌐 {kn ? "ಅಧಿಕೃತ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ" : "Apply on Official Site"}
      </button>

      <button
        className="btn btn-sky"
        onClick={() => window.open(`tel:${scheme.helpline}`)}
      >
        📞 {kn ? "ಸಹಾಯ ಸಾಲು ಕರೆ ಮಾಡಿ" : "Call Helpline"} — {scheme.helpline}
      </button>

      <button className="btn btn-ochre" onClick={() => downloadTxt(scheme, lang)}>
        ⬇️ {kn ? "ಮಾಹಿತಿ ಉಳಿಸಿ" : "Save Details"}
      </button>

      <button className="btn btn-ghost" onClick={onHome}>
        🏠 {kn ? "ಮುಖಪುಟಕ್ಕೆ" : "Go to Home"}
      </button>
    </div>
  );
}

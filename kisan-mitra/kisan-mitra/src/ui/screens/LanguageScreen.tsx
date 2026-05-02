import React, { useEffect } from "react";
import type { Lang } from "../../domain/schemes";

export default function LanguageScreen({
  lang, onSelect, onContinue,
}: { lang: Lang; onSelect: (l: Lang) => void; onContinue: () => void }) {
  useEffect(() => {
    setTimeout(() => {
      const u = new SpeechSynthesisUtterance("ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ. Choose your language.");
      u.lang = "kn-IN"; u.rate = 0.85;
      window.speechSynthesis?.speak(u);
    }, 600);
  }, []);

  return (
    <div className="screen" style={{ justifyContent: "center", minHeight: "70vh" }}>
      <div className="mascot-wrap" style={{ marginBottom: 24 }}>
        <div className="mascot">👨‍🌾</div>
        <div className="mascot-bubble">
          ನಮಸ್ಕಾರ! ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ<br />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Choose your language</span>
        </div>
      </div>

      <div className="stack">
        <button className={"lang-card " + (lang === "kn" ? "selected" : "")} onClick={() => onSelect("kn")}>
          <span style={{ fontSize: 22 }}>🅺</span>
          <span style={{ fontSize: 20, fontWeight: 900 }}>ಕನ್ನಡ</span>
          {lang === "kn" && <span style={{ fontSize: 20 }}>✅</span>}
        </button>

        <button className={"lang-card " + (lang === "en" ? "selected" : "")} onClick={() => onSelect("en")}>
          <span style={{ fontSize: 22 }}>🇮🇳</span>
          <span style={{ fontSize: 20, fontWeight: 900 }}>English</span>
          {lang === "en" && <span style={{ fontSize: 20 }}>✅</span>}
        </button>

        <button className="btn btn-green mt8" onClick={onContinue}>
          {lang === "kn" ? "ಮುಂದೆ →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

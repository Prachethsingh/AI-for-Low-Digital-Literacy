import React, { useEffect, useState } from "react";
import type { Lang, Scheme, UserProfile } from "../../domain/schemes";
import { SCHEMES } from "../../domain/schemes";
import type { SpeechApi } from "../speech/useSpeech";

function SkeletonList() {
  return (
    <div className="stack">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skel-circle" />
          <div className="skel-lines">
            <div className="skeleton skel-line" style={{ width: "55%" }} />
            <div className="skeleton skel-line" style={{ width: "75%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SchemeListScreen({
  lang, schemeIds, profile, speech, onPick, onBack,
}: {
  lang: Lang; schemeIds: string[]; profile: UserProfile;
  speech: SpeechApi; onPick: (id: string) => void; onBack: () => void;
}) {
  const kn = lang === "kn";
  const [loading, setLoading] = useState(true);
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const resolved = SCHEMES.filter((s) => schemeIds.includes(s.id));
      setSchemes(resolved);
      setLoading(false);
      speech.speak(
        kn
          ? `ನಿಮಗೆ ${resolved.length} ಯೋಜನೆ ಅರ್ಹ. ಒಂದು ಆಯ್ಕೆ ಮಾಡಿ.`
          : `You qualify for ${resolved.length} schemes. Please choose one.`
      );
    }, 900);
    return () => clearTimeout(timer);
  }, [schemeIds]);

  return (
    <div className="screen">
      <div className="back-row">
        <button className="back-btn" onClick={onBack}>← {kn ? "ಹಿಂದೆ" : "Back"}</button>
      </div>

      {loading ? (
        <>
          <div className="h2">{kn ? "ಹುಡುಕುತ್ತಿದ್ದೇವೆ…" : "Checking…"}</div>
          <p className="muted">{kn ? "ನಿಮ್ಮ ಅರ್ಹ ಯೋಜನೆ ಕಂಡುಹಿಡಿಯುತ್ತಿದ್ದೇವೆ" : "Finding your eligible schemes"}</p>
          <SkeletonList />
        </>
      ) : (
        <>
          <div className="row">
            <div>
              <div className="h2">{kn ? "ನಿಮ್ಮ ಯೋಜನೆಗಳು" : "Your Schemes"}</div>
              <p className="muted mt4">
                {schemes.length > 0
                  ? kn
                    ? `${schemes.length} ಯೋಜನೆ ನಿಮಗೆ ಅರ್ಹ`
                    : `${schemes.length} schemes you qualify for`
                  : kn ? "ಯಾವ ಯೋಜನೆಯೂ ಸಿಗಲಿಲ್ಲ" : "No schemes found"}
              </p>
            </div>
            {schemes.length > 0 && (
              <span className="eligible-badge">✅ {schemes.length}</span>
            )}
          </div>

          {schemes.length === 0 ? (
            <div className="notice mt12">
              {kn
                ? "ನಿಮ್ಮ ಉತ್ತರಗಳ ಆಧಾರದ ಮೇಲೆ ಯಾವ ಯೋಜನೆಯೂ ತಕ್ಕಂತಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
                : "Based on your answers, no matching schemes were found. Please try again."}
            </div>
          ) : (
            <div className="scheme-list mt8">
              {schemes.map((s) => (
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
          )}
        </>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import type { Lang, UserProfile } from "../../domain/schemes";
import type { SpeechApi } from "../speech/useSpeech";
import { logEvent } from "../../lib/supabase";

type Step = "farmer" | "aadhaar" | "woman";

const STEPS: Step[] = ["farmer", "aadhaar", "woman"];

const QUESTIONS: Record<Step, { kn: string; en: string; icon: string }> = {
  farmer:  { icon: "🌾", kn: "ನೀವು ರೈತರೇ?",            en: "Are you a farmer?" },
  aadhaar: { icon: "🪪", kn: "ನಿಮ್ಮ ಬಳಿ ಆಧಾರ್ ಇದೆಯಾ?",   en: "Do you have an Aadhaar card?" },
  woman:   { icon: "👩", kn: "ನೀವು ಮಹಿಳೆಯೇ?",            en: "Are you a woman?" },
};

export default function ProfileScreen({
  lang, speech, onDone, onBack,
}: {
  lang: Lang; speech: SpeechApi;
  onDone: (p: UserProfile) => void;
  onBack: () => void;
}) {
  const kn = lang === "kn";
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserProfile>>({});

  const step = STEPS[stepIdx];
  const q = QUESTIONS[step];
  const progress = Math.round((stepIdx / STEPS.length) * 100);

  useEffect(() => {
    speech.speak(kn ? q.kn : q.en);
  }, [stepIdx, lang]);

  const answer = (val: boolean) => {
    const updated = {
      ...answers,
      [step === "farmer" ? "isFarmer" : step === "aadhaar" ? "hasAadhaar" : "isWoman"]: val,
    };
    setAnswers(updated);

    if (stepIdx < STEPS.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      const finalProfile = {
        isFarmer: updated.isFarmer ?? false,
        hasAadhaar: updated.hasAadhaar ?? false,
        isWoman: updated.isWoman ?? false,
      };
      logEvent("profile_completed", finalProfile);
      onDone(finalProfile);
    }
  };

  return (
    <div className="screen">
      {/* Back */}
      <div className="back-row">
        <button className="back-btn" onClick={stepIdx > 0 ? () => setStepIdx((i) => i - 1) : onBack}>
          ← {kn ? "ಹಿಂದೆ" : "Back"}
        </button>
      </div>

      {/* Progress */}
      <div className="progress-wrap">
        <div className="step-badge">{stepIdx + 1}</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 800, color: "var(--mud)" }}>
          {stepIdx + 1}/{STEPS.length}
        </span>
      </div>

      {/* Question card */}
      <div className="question-card" key={step}>
        <div className="q-icon">{q.icon}</div>
        <div className="q-text">{kn ? q.kn : q.en}</div>
      </div>

      {/* Yes / No */}
      <div className="yn-row">
        <button className="yn-btn yn-yes" onClick={() => answer(true)}>
          👍 {kn ? "ಹೌದು" : "Yes"}
        </button>
        <button className="yn-btn yn-no" onClick={() => answer(false)}>
          👎 {kn ? "ಇಲ್ಲ" : "No"}
        </button>
      </div>

      {/* Listen button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <button
          className={"listen-btn " + (speech.speaking ? "speaking" : "")}
          onClick={() => speech.speak(kn ? q.kn : q.en)}
        >
          🔊 {kn ? "ಮತ್ತೆ ಕೇಳಿ" : "Listen again"}
        </button>
      </div>

      <p className="muted center mt8" style={{ fontSize: 13 }}>
        {kn ? "ಉತ್ತರ ಒತ್ತಿ ಮುಂದೆ ಹೋಗಿ" : "Tap your answer to continue"}
      </p>
    </div>
  );
}

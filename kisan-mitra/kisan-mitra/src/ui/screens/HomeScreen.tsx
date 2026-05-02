import React, { useEffect } from "react";
import type { Lang, UserProfile } from "../../domain/schemes";
import type { SpeechApi } from "../speech/useSpeech";

export default function HomeScreen({
  lang, speech, profile, onCheckSchemes, onVoice, onAllSchemes, onCall,
}: {
  lang: Lang; speech: SpeechApi; profile: UserProfile;
  onCheckSchemes: () => void; onVoice: () => void;
  onAllSchemes: () => void; onCall: () => void;
}) {
  const kn = lang === "kn";

  useEffect(() => {
    speech.speak(
      kn
        ? "ನಮಸ್ಕಾರ! ಸರ್ಕಾರಿ ಯೋಜನೆ ಪರಿಶೀಲಿಸಲು ಅಥವಾ ಪ್ರಶ್ನೆ ಕೇಳಲು ಒತ್ತಿ."
        : "Hello! Tap to check your schemes or ask any question."
    );
  }, [lang]);

  return (
    <div className="screen">
      {/* Mascot */}
      <div className="mascot-wrap mt4">
        <div className="mascot">👨‍🌾</div>
        <div className="mascot-bubble">
          {kn
            ? "ನಮಸ್ಕಾರ! ನಿಮಗೆ ಏನು ಸಹಾಯ ಮಾಡಲಿ?"
            : "Hello! How can I help you today?"}
        </div>
      </div>

      {/* Primary CTA */}
      <button className="action-card primary mt12" onClick={onCheckSchemes}>
        <span className="ac-icon">🌾</span>
        <span>
          <div className="ac-label">{kn ? "ಯೋಜನೆ ಪರಿಶೀಲಿಸಿ" : "Check My Schemes"}</div>
          <div className="ac-sub" style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 3 }}>
            {kn ? "ನಿಮಗೆ ಅರ್ಹ ಯೋಜನೆ ಕಂಡುಹಿಡಿಯಿರಿ" : "Find schemes you qualify for"}
          </div>
        </span>
      </button>

      {/* 2-col grid */}
      <div className="action-grid">
        <button className="action-card" onClick={onVoice}>
          <span className="ac-icon">🎤</span>
          <span className="ac-label">{kn ? "ಪ್ರಶ್ನೆ ಕೇಳಿ" : "Ask AI"}</span>
          <span className="ac-sub">{kn ? "ಮಾತನಾಡಿ" : "Speak your question"}</span>
        </button>

        <button className="action-card" onClick={onAllSchemes}>
          <span className="ac-icon">📋</span>
          <span className="ac-label">{kn ? "ಎಲ್ಲ ಯೋಜನೆ" : "All Schemes"}</span>
          <span className="ac-sub">{kn ? "ಪಟ್ಟಿ ನೋಡಿ" : "Browse all"}</span>
        </button>

        <button className="action-card" onClick={onCall}>
          <span className="ac-icon">📞</span>
          <span className="ac-label">{kn ? "ಸಹಾಯ ಸಾಲು" : "Helpline"}</span>
          <span className="ac-sub">155261</span>
        </button>

        <button className="action-card" onClick={() => speech.speak(
          kn ? "ಕಿಸಾನ್ ಮಿತ್ರ ಅಪ್ಲಿಕೇಶನ್. ಸರ್ಕಾರಿ ಯೋಜನೆ ಮಾಹಿತಿ ಮತ್ತು ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಸಹಾಯ."
            : "Kisan Mitra helps you find and apply for government schemes for farmers."
        )}>
          <span className="ac-icon">ℹ️</span>
          <span className="ac-label">{kn ? "ಬಗ್ಗೆ" : "About"}</span>
          <span className="ac-sub">{kn ? "ಈ ಅಪ್ ಬಗ್ಗೆ" : "About this app"}</span>
        </button>
      </div>

      {/* Tagline */}
      <p className="muted center mt4" style={{ fontSize: 12 }}>
        {kn
          ? "✅ ಎಲ್ಲ ಮಾಹಿತಿ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಮೂಲಗಳಿಂದ"
          : "✅ All info from official Government of India sources"}
      </p>
    </div>
  );
}

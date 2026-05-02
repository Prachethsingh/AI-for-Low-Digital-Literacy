import React, { useEffect, useRef, useState } from "react";
import type { Lang } from "../../domain/schemes";
import { SCHEMES } from "../../domain/schemes";
import type { SpeechApi } from "../speech/useSpeech";

interface Message { role: "user" | "ai"; text: string; schemeId?: string }

// ── Local rule-based AI fallback (no server needed) ──────────────────────────
function localAnswer(query: string, lang: Lang): { text: string; schemeId?: string } {
  const q = query.toLowerCase();
  const kn = lang === "kn";

  for (const s of SCHEMES) {
    const name = (s.en + " " + s.kn + " " + s.id).toLowerCase();
    if (name.split(" ").some((w) => q.includes(w) && w.length > 3)) {
      return {
        text: kn
          ? `${s.kn}: ${s.descKn} ಸಹಾಯ ಸಾಲು: ${s.helpline}`
          : `${s.en}: ${s.descEn} Helpline: ${s.helpline}`,
        schemeId: s.id,
      };
    }
  }

  // Generic keywords
  if (q.includes("kisan") || q.includes("ರೈತ") || q.includes("farmer")) {
    return {
      text: kn
        ? "ರೈತರಿಗಾಗಿ PM-KISAN (₹6000/ವರ್ಷ), PMFBY (ಬೆಳೆ ವಿಮೆ), KCC (ಸಾಲ), PMKSY (ನೀರಾವರಿ) ಮತ್ತು PM-KUSUM (ಸೌರ ಪಂಪ್) ಯೋಜನೆಗಳಿವೆ."
        : "For farmers: PM-KISAN (₹6000/yr), PMFBY (crop insurance), KCC (loans), PMKSY (irrigation) and PM-KUSUM (solar pump).",
    };
  }
  if (q.includes("aadhaar") || q.includes("ಆಧಾರ್")) {
    return {
      text: kn
        ? "ಬಹಳಷ್ಟು ಯೋಜನೆಗಳಿಗೆ ಆಧಾರ್ ಕಾರ್ಡ್ ಬೇಕು. PM Jan Dhan ಖಾತೆ ತೆರೆಯಲು ಆಧಾರ್ ಮಾತ್ರ ಸಾಕು."
        : "Most schemes require Aadhaar. For PM Jan Dhan bank account, Aadhaar alone is enough.",
      schemeId: "pmjdy",
    };
  }
  if (q.includes("insurance") || q.includes("bima") || q.includes("ವಿಮೆ")) {
    return { text: kn ? "PMFBY ಬೆಳೆ ವಿಮೆ ಯೋಜನೆ. ₹14447 ಗೆ ಕರೆ ಮಾಡಿ." : "PMFBY crop insurance. Call 14447.", schemeId: "pmfby" };
  }
  if (q.includes("pension") || q.includes("ಪಿಂಚಣಿ")) {
    return { text: kn ? "PM-KMY: 60 ವರ್ಷ ನಂತರ ₹3000/ತಿಂಗಳ ಪಿಂಚಣಿ." : "PM-KMY: ₹3000/month pension after age 60.", schemeId: "pmkmy" };
  }
  if (q.includes("solar") || q.includes("ಸೌರ") || q.includes("kusum")) {
    return { text: kn ? "PM-KUSUM: ಸೌರ ನೀರಾವರಿ ಪಂಪ್ ಅಳವಡಿಕೆ. 1800-180-3333." : "PM-KUSUM: Solar irrigation pump subsidy. Call 1800-180-3333.", schemeId: "pmkusum" };
  }
  if (q.includes("loan") || q.includes("ಸಾಲ") || q.includes("credit")) {
    return { text: kn ? "KCC: ಕಡಿಮೆ ಬಡ್ಡಿ ದರದಲ್ಲಿ ಕೃಷಿ ಸಾಲ. 1800-180-1551." : "KCC: Low-interest farm loan. Call 1800-180-1551.", schemeId: "kcc" };
  }
  if (q.includes("house") || q.includes("home") || q.includes("ಮನೆ") || q.includes("awas")) {
    return { text: kn ? "PM Awas Yojana: ಸ್ವಂತ ಮನೆ ಕಟ್ಟಲು ಸಹಾಯ. 1800-11-3377." : "PM Awas: Housing subsidy for poor families. Call 1800-11-3377.", schemeId: "pmay" };
  }
  if (q.includes("women") || q.includes("mahila") || q.includes("ಮಹಿಳ") || q.includes("maternity") || q.includes("pregnant")) {
    return { text: kn ? "PMMVY: ಗರ್ಭಿಣಿ ಮಹಿಳೆಗೆ ₹5,000 ಸಹಾಯ. WCD ಕಚೇರಿಗೆ ಭೇಟಿ ಮಾಡಿ." : "PMMVY: ₹5,000 for pregnant women's first child. Visit WCD office.", schemeId: "pmmvy" };
  }

  return {
    text: kn
      ? "ಕ್ಷಮಿಸಿ, ಆ ವಿಷಯ ನನಗೆ ತಿಳಿದಿಲ್ಲ. ಸಹಾಯ ಸಾಲು 155261 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ಯೋಜನೆ ಪಟ್ಟಿ ನೋಡಿ."
      : "I'm not sure about that. Please call helpline 155261 or browse all schemes.",
  };
}

import { askGroq } from "../../lib/groq";
import { logUserSession } from "../../lib/supabase";

export default function VoiceScreen({
  lang, speech, onBack, onSchemeDetail,
}: {
  lang: Lang; speech: SpeechApi;
  onBack: () => void;
  onSchemeDetail: (id: string) => void;
}) {
  const kn = lang === "kn";
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const examples = kn
    ? ["PM-KISAN ಏನು?", "ಬೆಳೆ ವಿಮೆ ಹೇಗೆ?", "ಸೌರ ಪಂಪ್ ಸಹಾಯ", "ಮಹಿಳಾ ಯೋಜನೆ"]
    : ["What is PM-KISAN?", "How to get crop insurance?", "Solar pump scheme", "Women's maternity benefit"];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [msgs, thinking]);

  const handleQuery = async (text: string) => {
    if (!text.trim()) return;
    setMsgs((p) => [...p, { role: "user", text }]);
    setThinking(true);

    // Try Groq first, then local fallback
    let answer: string;
    let schemeId: string | undefined;

    const groqReply = await askGroq(text, lang);
    if (groqReply) {
      answer = groqReply;
    } else {
      const local = localAnswer(text, lang);
      answer = local.text;
      schemeId = local.schemeId;
    }

    // Log to Supabase
    logUserSession(text, lang, answer, schemeId);

    setThinking(false);
    setMsgs((p) => [...p, { role: "ai", text: answer, schemeId }]);
    speech.speak(answer);
  };

  const startVoice = () => {
    speech.startListening();
  };

  // When listening stops and transcript appears, send it
  useEffect(() => {
    if (!speech.listening && speech.transcript) {
      handleQuery(speech.transcript);
      speech.clearTranscript();
    }
  }, [speech.listening]);

  return (
    <div className="screen" style={{ paddingBottom: 12 }}>
      {/* Header */}
      <div className="back-row">
        <button className="back-btn" onClick={onBack}>← {kn ? "ಹಿಂದೆ" : "Back"}</button>
        {msgs.length > 0 && (
          <button
            className="back-btn"
            style={{ marginLeft: "auto", color: "var(--danger)" }}
            onClick={() => { setMsgs([]); speech.stop(); }}
          >
            🗑 {kn ? "ಮಿಟ್ಟೆ" : "Clear"}
          </button>
        )}
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="chat-area"
        style={{ maxHeight: "40vh", overflowY: "auto" }}
      >
        {msgs.length === 0 && !thinking && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 60 }}>🎙️</div>
            <div className="h3 mt8">
              {kn ? "ಮೈಕ್ ಒತ್ತಿ ಪ್ರಶ್ನೆ ಕೇಳಿ" : "Tap mic and ask any question"}
            </div>
            <p className="muted mt4" style={{ fontSize: 13 }}>
              {kn ? "ಕನ್ನಡ ಮತ್ತು English ಎರಡೂ ಸ್ವೀಕರಿಸಲಾಗುತ್ತದೆ" : "Kannada & English both accepted"}
            </p>
          </div>
        )}

        {msgs.map((m, i) => (
          <div
            key={i}
            className={"chat-bubble " + (m.role === "user" ? "bubble-user" : "bubble-ai")}
          >
            {m.role === "ai" && (
              <div className="bubble-label">🌿 {kn ? "ಕಿಸಾನ್ ಮಿತ್ರ" : "Kisan Mitra"}</div>
            )}
            {m.text}
            {m.role === "ai" && (
              <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="replay-btn" onClick={() => speech.speak(m.text)}>
                  🔊 {kn ? "ಮತ್ತೆ" : "Replay"}
                </button>
                {m.schemeId && (
                  <button
                    className="replay-btn"
                    style={{ color: "var(--terracotta)" }}
                    onClick={() => onSchemeDetail(m.schemeId!)}
                  >
                    📋 {kn ? "ಹೆಚ್ಚು ತಿಳಿಯಿರಿ" : "Learn more"}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {thinking && (
          <div className="chat-bubble bubble-ai">
            <div className="bubble-label">🌿 {kn ? "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ…" : "Thinking…"}</div>
            <div style={{ display: "flex", gap: 5, padding: "4px 0" }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: "var(--clay)",
                    animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
          </div>
        )}
      </div>

      {/* Example chips */}
      {msgs.length === 0 && (
        <div>
          <p className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
            {kn ? "ಉದಾಹರಣೆ:" : "Try asking:"}
          </p>
          <div className="example-chips">
            {examples.map((ex, i) => (
              <button key={i} className="example-chip" onClick={() => handleQuery(ex)}>
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mic button */}
      <div className="mic-area mt12">
        <div className={"mic-ring " + (speech.listening ? "active" : "")}>
          <button
            className={"mic-btn " + (speech.listening ? "recording" : "")}
            onClick={speech.listening ? speech.stop : startVoice}
          >
            {speech.listening ? "⏹" : "🎤"}
          </button>
        </div>
        <p className="muted" style={{ fontSize: 14, fontWeight: 700, textAlign: "center" }}>
          {speech.listening
            ? (kn ? "⏺ ಕೇಳುತ್ತಿದ್ದೇನೆ…" : "⏺ Listening…")
            : (kn ? "ಒಮ್ಮೆ ಒತ್ತಿ ಮಾತನಾಡಿ" : "Tap to speak")}
        </p>
        {speech.listening && speech.transcript && (
          <div className="notice" style={{ maxWidth: "100%", textAlign: "center" }}>
            "{speech.transcript}"
          </div>
        )}
      </div>
    </div>
  );
}

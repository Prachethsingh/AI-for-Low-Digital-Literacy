import React, { useState } from "react";
import type { Lang, Scheme, UserProfile } from "../domain/schemes";
import { SCHEMES, getEligibleSchemes } from "../domain/schemes";
import { useSpeech } from "./speech/useSpeech";
import LanguageScreen from "./screens/LanguageScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SchemeListScreen from "./screens/SchemeListScreen";
import SchemeDetailScreen from "./screens/SchemeDetailScreen";
import FlowScreen from "./screens/FlowScreen";
import SummaryScreen from "./screens/SummaryScreen";
import DoneScreen from "./screens/DoneScreen";
import VoiceScreen from "./screens/VoiceScreen";
import AllSchemesScreen from "./screens/AllSchemesScreen";
import LiveDashboard from "./screens/LiveDashboard";

type Route =
  | { name: "lang" }
  | { name: "home" }
  | { name: "profile" }
  | { name: "scheme-list"; schemeIds: string[] }
  | { name: "all-schemes" }
  | { name: "scheme-detail"; schemeId: string }
  | { name: "flow"; schemeId: string }
  | { name: "summary"; schemeId: string }
  | { name: "done"; schemeId: string }
  | { name: "voice" }
  | { name: "dashboard" };

export type Answers = Record<string, string | boolean>;

export default function App() {
  const [lang, setLang] = useState<Lang>("kn");
  const [route, setRoute] = useState<Route>({ name: "lang" });
  const [profile, setProfile] = useState<UserProfile>({
    isFarmer: false,
    hasAadhaar: false,
    isWoman: false,
  });
  const [answersByScheme, setAnswersByScheme] = useState<Record<string, Answers>>({});
  const speech = useSpeech(lang);

  const go = (r: Route) => setRoute(r);
  const goHome = () => setRoute({ name: "home" });

  const currentScheme = (id: string): Scheme | undefined =>
    SCHEMES.find((s) => s.id === id);

  // ── Bottom nav (shown on main screens) ──────────────────────────────────
  const showNav = ["home", "all-schemes", "voice", "dashboard"].includes(route.name);
  const navItems: { icon: string; label: string; screen: Route["name"]; route: Route }[] = [
    { icon: "🏠", label: lang === "kn" ? "ಮನೆ" : "Home",      screen: "home",        route: { name: "home" } },
    { icon: "🌾", label: lang === "kn" ? "ಯೋಜನೆ" : "Schemes", screen: "all-schemes", route: { name: "all-schemes" } },
    { icon: "🎤", label: lang === "kn" ? "ಕೇಳಿ" : "Ask",      screen: "voice",       route: { name: "voice" } },
    { icon: "📈", label: "Live",          screen: "dashboard",   route: { name: "dashboard" } },
  ];

  return (
    <div className="shell">
      <div className="phone">
        {/* ── Top bar ─────────────────────────────── */}
        <header className="topbar">
          <div className="brand">
            <span className="brand-leaf">🌿</span>
            {lang === "kn" ? "ಕಿಸಾನ್ ಮಿತ್ರ" : "Kisan Mitra"}
          </div>
          {route.name !== "lang" && (
            <button className="lang-toggle" onClick={() => setLang((l) => l === "kn" ? "en" : "kn")}>
              {lang === "kn" ? "EN" : "ಕನ್ನಡ"}
            </button>
          )}
        </header>

        {/* ── Screens ──────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {route.name === "lang" && (
            <LanguageScreen lang={lang} onSelect={setLang} onContinue={goHome} />
          )}

          {route.name === "home" && (
            <HomeScreen
              lang={lang}
              speech={speech}
              profile={profile}
              onCheckSchemes={() => go({ name: "profile" })}
              onVoice={() => go({ name: "voice" })}
              onAllSchemes={() => go({ name: "all-schemes" })}
              onCall={() => window.open("tel:155261")}
            />
          )}

          {route.name === "profile" && (
            <ProfileScreen
              lang={lang}
              speech={speech}
              onDone={(p) => {
                setProfile(p);
                const eligible = getEligibleSchemes(p);
                go({ name: "scheme-list", schemeIds: eligible.map((s) => s.id) });
              }}
              onBack={goHome}
            />
          )}

          {route.name === "scheme-list" && (
            <SchemeListScreen
              lang={lang}
              schemeIds={route.schemeIds}
              profile={profile}
              speech={speech}
              onPick={(id) => go({ name: "scheme-detail", schemeId: id })}
              onBack={goHome}
            />
          )}

          {route.name === "all-schemes" && (
            <AllSchemesScreen
              lang={lang}
              speech={speech}
              onPick={(id) => go({ name: "scheme-detail", schemeId: id })}
            />
          )}

          {route.name === "scheme-detail" && (() => {
            const s = currentScheme(route.schemeId);
            return s ? (
              <SchemeDetailScreen
                lang={lang}
                scheme={s}
                speech={speech}
                onApply={() => go({ name: "flow", schemeId: s.id })}
                onBack={() => history.length > 1 ? setRoute({ name: "all-schemes" }) : goHome()}
              />
            ) : null;
          })()}

          {route.name === "flow" && (() => {
            const s = currentScheme(route.schemeId);
            return s ? (
              <FlowScreen
                lang={lang}
                scheme={s}
                speech={speech}
                initialAnswers={answersByScheme[s.id] ?? {}}
                onBack={() => go({ name: "scheme-detail", schemeId: s.id })}
                onDone={(ans) => {
                  setAnswersByScheme((p) => ({ ...p, [s.id]: ans }));
                  go({ name: "summary", schemeId: s.id });
                }}
              />
            ) : null;
          })()}

          {route.name === "summary" && (() => {
            const s = currentScheme(route.schemeId);
            return s ? (
              <SummaryScreen
                lang={lang}
                scheme={s}
                answers={answersByScheme[s.id] ?? {}}
                onBack={() => go({ name: "flow", schemeId: s.id })}
                onConfirm={() => go({ name: "done", schemeId: s.id })}
              />
            ) : null;
          })()}

          {route.name === "done" && (() => {
            const s = currentScheme(route.schemeId);
            return s ? (
              <DoneScreen lang={lang} scheme={s} speech={speech} onHome={goHome} />
            ) : null;
          })()}

          {route.name === "voice" && (
            <VoiceScreen
              lang={lang}
              speech={speech}
              onBack={goHome}
              onSchemeDetail={(id) => go({ name: "scheme-detail", schemeId: id })}
            />
          )}

          {route.name === "dashboard" && (
            <LiveDashboard onBack={goHome} />
          )}
        </div>

        {/* ── Bottom nav ────────────────────────────── */}
        {showNav && (
          <nav className="bottom-nav">
            {navItems.map((n) => (
              <button
                key={n.screen}
                className={"nav-btn " + (route.name === n.screen ? "active" : "")}
                onClick={() => go(n.route)}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

export { App };

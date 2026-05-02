import React, { useMemo, useState } from "react";
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  Container, 
  Typography, 
  IconButton, 
  Button, 
  BottomNavigation, 
  BottomNavigationAction,
  Paper
} from "@mui/material";
import { 
  Language as LanguageIcon, 
  Home as HomeIcon, 
  Assignment as SchemeIcon, 
  Help as HelpIcon,
  SwapHoriz
} from "@mui/icons-material";
import type { Language } from "../domain/i18n";
import { t } from "../domain/i18n";
import { extendDictionaries } from "../domain/extraStrings";
import type { SchemeId } from "../domain/schemes";
import { schemes } from "../domain/schemes";
import { useSpeech } from "./speech/useSpeech";
import { LanguageScreen } from "./screens/LanguageScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SchemeScreen } from "./screens/SchemeScreen";
import { FlowScreen } from "./screens/FlowScreen";
import { SummaryScreen } from "./screens/SummaryScreen";
import { DoneScreen } from "./screens/DoneScreen";

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Success Green
    },
    secondary: {
      main: '#1565c0',
    },
    background: {
      default: '#f1f8e9',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 800,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

type Route =
  | { name: "language" }
  | { name: "home" }
  | { name: "scheme" }
  | { name: "flow"; schemeId: SchemeId }
  | { name: "summary"; schemeId: SchemeId }
  | { name: "done"; schemeId: SchemeId };

extendDictionaries();

export type Answers = Record<string, string | boolean>;

export function App() {
  const [lang, setLang] = useState<Language>("en");
  const [route, setRoute] = useState<Route>({ name: "language" });
  const [answersByScheme, setAnswersByScheme] = useState<Record<SchemeId, Answers>>({
    pmkisan: {},
    pmfby: {}
  });

  const scheme = useMemo(() => {
    if (route.name === "flow" || route.name === "summary" || route.name === "done") {
      return schemes.find((s) => s.id === route.schemeId);
    }
    return undefined;
  }, [route]);

  const speech = useSpeech({ lang });

  const renderScreen = () => {
    switch (route.name) {
      case "language":
        return (
          <LanguageScreen
            lang={lang}
            onSelect={(l) => setLang(l)}
            onContinue={() => setRoute({ name: "home" })}
          />
        );
      case "home":
        return (
          <HomeScreen
            lang={lang}
            speech={speech}
            onChooseScheme={() => setRoute({ name: "scheme" })}
          />
        );
      case "scheme":
        return (
          <SchemeScreen
            lang={lang}
            onPick={(schemeId) => setRoute({ name: "flow", schemeId })}
            onBack={() => setRoute({ name: "home" })}
          />
        );
      case "flow":
        return scheme && (
          <FlowScreen
            key={route.schemeId}
            lang={lang}
            scheme={scheme}
            speech={speech}
            initialAnswers={answersByScheme[route.schemeId]}
            onBack={() => setRoute({ name: "scheme" })}
            onDone={(answers) => {
              setAnswersByScheme((prev) => ({ ...prev, [route.schemeId]: answers }));
              setRoute({ name: "summary", schemeId: route.schemeId });
            }}
          />
        );
      case "summary":
        return scheme && (
          <SummaryScreen
            lang={lang}
            scheme={scheme}
            answers={answersByScheme[route.schemeId]}
            onBack={() => setRoute({ name: "flow", schemeId: route.schemeId })}
            onContinue={() => setRoute({ name: "done", schemeId: route.schemeId })}
          />
        );
      case "done":
        return scheme && (
          <DoneScreen
            lang={lang}
            scheme={scheme}
            onHome={() => setRoute({ name: "home" })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        bgcolor: 'grey.100'
      }}>
        <Paper elevation={12} sx={{ 
          width: { xs: '100%', sm: 400 }, 
          height: { xs: '100%', sm: 800 }, 
          borderRadius: { sm: 4 },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
              {t(lang, "app_name")}
            </Typography>
            <Button 
              size="small"
              startIcon={<SwapHoriz />}
              onClick={() => setLang(l => l === 'en' ? 'kn' : 'en')}
            >
              {lang === 'kn' ? 'ಕನ್ನಡ' : 'English'}
            </Button>
          </Box>

          {/* Screen Content */}
          <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'background.default' }}>
            {renderScreen()}
          </Box>

          {/* Footer Navigation */}
          {route.name !== "language" && (
            <Paper sx={{ position: 'sticky', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation
                value={route.name === 'home' ? 0 : route.name === 'scheme' ? 1 : -1}
                onChange={(_, newValue) => {
                  if (newValue === 0) setRoute({ name: 'home' });
                  if (newValue === 1) setRoute({ name: 'scheme' });
                  if (newValue === 2) speech.speak(t(lang, "voice_not_supported"));
                }}
                showLabels
              >
                <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Schemes" icon={<SchemeIcon />} />
                <BottomNavigationAction label="Help" icon={<HelpIcon />} />
              </BottomNavigation>
            </Paper>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
}


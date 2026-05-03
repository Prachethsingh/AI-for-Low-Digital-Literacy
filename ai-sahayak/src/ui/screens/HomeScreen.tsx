import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  Paper,
  Fade,
  CircularProgress
} from "@mui/material";
import { Mic as MicIcon, ArrowForward, RotateLeft, AutoAwesome } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import type { Language } from "../../domain/i18n";
import { t } from "../../domain/i18n";
import type { useSpeech } from "../speech/useSpeech";

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.4);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(46, 125, 50, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(46, 125, 50, 0);
  }
`;

type SpeechApi = ReturnType<typeof useSpeech>;

export function HomeScreen(props: {
  lang: Language;
  speech: SpeechApi;
  onChooseScheme: () => void;
}) {
  const { lang, speech, onChooseScheme } = props;
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    speech.speak(`${t(lang, "namaste")} ${t(lang, "how_can_help")}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    if (!speech.listening && speech.transcript) {
      askBackend(speech.transcript);
    }
  }, [speech.listening, speech.transcript]);

  const askBackend = async (query: string) => {
    setIsLoading(true);
    setAiResponse(null);
    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, language: lang === "kn" ? "kannada" : "english" }),
      });
      const data = await response.json();
      setAiResponse(data.response);
      speech.speak(data.response);
    } catch (error) {
      console.error("Backend error:", error);
      const fallback = lang === "kn" ? "ಕ್ಷಮಿಸಿ, ಸರ್ವರ್ ಲಭ್ಯವಿಲ್ಲ." : "Sorry, server unreachable.";
      setAiResponse(fallback);
      speech.speak(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    speech.clearTranscript();
    setAiResponse(null);
  };

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" align="center" sx={{ mt: 2, mb: 1, color: 'primary.main', fontWeight: 800 }}>
        {t(lang, "namaste")}
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        {t(lang, "how_can_help")}
      </Typography>

      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%'
      }}>
        <IconButton
          onClick={() => {
            setAiResponse(null);
            speech.startListening();
          }}
          sx={{
            width: 140,
            height: 140,
            bgcolor: speech.listening ? 'error.light' : 'primary.light',
            color: 'white',
            '&:hover': { bgcolor: speech.listening ? 'error.main' : 'primary.main' },
            animation: speech.listening ? `${pulse} 1.5s infinite` : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <MicIcon sx={{ fontSize: 60 }} />
        </IconButton>
        
        <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 700 }}>
          {speech.listening ? 'Listening...' : t(lang, "tap_to_speak")}
        </Typography>
      </Box>

      <AnimatePresence>
        {speech.transcript && (
          <Fade in={true}>
            <Paper sx={{ p: 2, mt: 2, width: '100%', bgcolor: 'rgba(46, 125, 50, 0.05)', borderRadius: 4 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                {speech.listening ? "I'm hearing..." : "You asked:"}
              </Typography>
              <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2, fontWeight: 500 }}>
                "{speech.transcript}"
              </Typography>
              
              {!speech.listening && isLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary">Thinking...</Typography>
                </Box>
              )}

              {!speech.listening && aiResponse && (
                <Fade in={true}>
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                      <AutoAwesome fontSize="small" />
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>Kisan AI</Typography>
                    </Box>
                    <Typography variant="body1">{aiResponse}</Typography>
                  </Box>
                </Fade>
              )}
              
              {!speech.listening && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<ArrowForward />}
                    onClick={onChooseScheme}
                    sx={{ borderRadius: 3 }}
                  >
                    {t(lang, "choose_scheme")}
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={handleReset}
                    sx={{ minWidth: 'auto', borderRadius: 3 }}
                  >
                    <RotateLeft />
                  </Button>
                </Box>
              )}
            </Paper>
          </Fade>
        )}
      </AnimatePresence>

      {!speech.transcript && !speech.listening && (
        <Button 
          fullWidth 
          variant="outlined" 
          onClick={onChooseScheme}
          sx={{ mt: 2, borderRadius: 3 }}
        >
          {t(lang, "choose_scheme")}
        </Button>
      )}
    </Box>
  );
}

const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;


import React, { useState, useEffect, useRef } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  IconButton, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  Avatar, 
  CircularProgress,
  Chip,
  Fade,
  Grow
} from '@mui/material';
import { 
  Mic, 
  Send, 
  Language, 
  Message, 
  AssignmentTurnedIn, 
  Info,
  PhoneIphone,
  History,
  TrendingUp,
  AccountCircle
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// --- Theme Definition ---
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2E7D32', // Forest Green
    },
    secondary: {
      main: '#A5D6A7',
    },
    background: {
      default: '#080C09',
      paper: '#121813',
    },
    text: {
      primary: '#E8F5E9',
      secondary: '#A5D6A7',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const API_BASE = 'http://localhost:8000';

interface Question {
  id: string;
  text: string;
}

interface MessageData {
  role: 'user' | 'assistant';
  content: string;
}

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'kn'>('en');
  const [mode, setMode] = useState<'idle' | 'chat' | 'eligibility'>('idle');
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [eligibleSchemes, setEligibleSchemes] = useState<any[]>([]);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Speech Recognition Init ---
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'en' ? 'en-IN' : 'kn-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, [lang]);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'en' ? 'en-IN' : 'kn-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const toggleLang = () => setLang(l => (l === 'en' ? 'kn' : 'en'));

  const startChat = () => {
    setMode('chat');
    const welcome = lang === 'en' 
      ? "Namaste! I am your Kisan Sahayak. How can I help you today?" 
      : "ನಮಸ್ತೆ! ನಾನು ನಿಮ್ಮ ಕಿಸಾನ್ ಸಹಾಯಕ್. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?";
    setMessages([{ role: 'assistant', content: welcome }]);
    speak(welcome);
  };

  const startEligibility = () => {
    setMode('eligibility');
    setQuestions([
      { id: 'farmer_type', text: lang === 'en' ? "Are you a small or marginal farmer?" : "ನೀವು ಸಣ್ಣ ಅಥವಾ ಅತಿ ಸಣ್ಣ ರೈತರೇ?" },
      { id: 'q2', text: lang === 'en' ? "Do you have an Aadhaar card?" : "ನಿಮ್ಮ ಬಳಿ ಆಧಾರ್ ಕಾರ್ಡ್ ಇದೆಯೇ?" },
      { id: 'q3', text: lang === 'en' ? "Is the land registered in your name?" : "ಭೂಮಿ ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ನೋಂದಣಿಯಾಗಿದೆಯೇ?" }
    ]);
    setCurrentQ(0);
    setAnswers({});
  };

  const handleSend = async (overrideInput?: string) => {
    const text = overrideInput || input;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/ask`, {
        query: text,
        lang: lang
      });
      const answer = res.data.response;
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
      speak(answer);
      
      // Track activity
      setActivityHistory(prev => [{
        type: 'query',
        text: text,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 5));
    } catch (err) {
      const errorMsg = "Could not reach AI. Please ensure the backend is running.";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      speak(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
    } else {
      setListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleAnswer = async (val: string) => {
    const qId = questions[currentQ].id;
    const newAnswers = { ...answers, [qId]: val };
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE}/eligibility`, {
          profile: newAnswers,
          lang: lang
        });
        const schemes = res.data.eligible_schemes || [];
        setEligibleSchemes(schemes);
        
        // Track activity
        setActivityHistory(prev => [{
          type: 'eligibility',
          text: `Found ${schemes.length} schemes`,
          timestamp: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 5));
        
        setMode('idle'); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default', 
        display: 'flex', 
        py: 4,
        background: 'radial-gradient(circle at 10% 20%, rgba(46, 125, 50, 0.1) 0%, rgba(8, 12, 9, 1) 90%)'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* --- Left Column: Info & Navigation --- */}
            <Grid item xs={12} md={4} component={motion.div} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Box sx={{ position: 'sticky', top: 32 }}>
                <Typography variant="h4" color="primary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  Kisan Sahayak <Box component="span" sx={{ fontSize: '0.5em', px: 1, py: 0.2, bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>BETA</Box>
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Empowering farmers with AI-driven scheme discovery and voice-first interaction.
                </Typography>

                <Paper sx={{ p: 1, mb: 3, display: 'flex', gap: 1, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Button 
                    fullWidth 
                    variant={lang === 'en' ? 'contained' : 'text'} 
                    onClick={() => setLang('en')}
                    startIcon={<Language />}
                  >
                    English
                  </Button>
                  <Button 
                    fullWidth 
                    variant={lang === 'kn' ? 'contained' : 'text'} 
                    onClick={() => setLang('kn')}
                  >
                    ಕನ್ನಡ
                  </Button>
                </Paper>

                <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    startIcon={<Message />} 
                    onClick={startChat}
                    sx={{ py: 2, borderRadius: 3, borderWidth: 2 }}
                  >
                    {lang === 'en' ? 'Start Voice Chat' : 'ಧ್ವನಿ ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ'}
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    startIcon={<AssignmentTurnedIn />} 
                    onClick={startEligibility}
                    sx={{ py: 2, borderRadius: 3, borderWidth: 2 }}
                  >
                    {lang === 'en' ? 'Check Eligibility' : 'ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ'}
                  </Button>
                </List>

                {eligibleSchemes.length > 0 && (
                  <Fade in={true}>
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="subtitle2" color="primary" sx={{ mb: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp fontSize="small" /> Eligible Schemes
                      </Typography>
                      {eligibleSchemes.map(s => (
                        <Paper key={s.id} sx={{ p: 2, mb: 1, borderLeft: '4px solid', borderColor: 'primary.main', background: 'rgba(46, 125, 50, 0.05)' }}>
                          <Typography variant="body2" fontWeight="bold">{s.name_en}</Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Fade>
                )}

                {/* --- Farmer Activity Tracker --- */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <History fontSize="small" /> Activity Tracker
                  </Typography>
                  <Paper sx={{ p: 0, overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <List sx={{ p: 0 }}>
                      {activityHistory.length === 0 ? (
                        <ListItem><ListItemText secondary="No recent activity" /></ListItem>
                      ) : (
                        activityHistory.map((h, i) => (
                          <ListItem key={i} sx={{ borderBottom: i < activityHistory.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: h.type === 'query' ? 'secondary.main' : 'primary.main' }}>
                              {h.type === 'query' ? <Message sx={{ fontSize: 16 }} /> : <AssignmentTurnedIn sx={{ fontSize: 16 }} />}
                            </Avatar>
                            <ListItemText 
                              primary={h.text} 
                              secondary={h.timestamp}
                              primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItem>
                        ))
                      )}
                    </List>
                  </Paper>
                </Box>
              </Box>
            </Grid>

            {/* --- Right Column: Phone Emulator --- */}
            <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ 
                width: 380, 
                height: 780, 
                bgcolor: '#000', 
                borderRadius: '50px', 
                p: 1.5, 
                border: '8px solid #222',
                boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Notch */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  width: 150, 
                  height: 30, 
                  bgcolor: '#222', 
                  borderBottomLeftRadius: 20, 
                  borderBottomRightRadius: 20, 
                  zIndex: 10 
                }} />

                <Paper sx={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '35px', 
                  bgcolor: '#0A0F0B', 
                  display: 'flex', 
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}>
                  {/* Status Bar */}
                  <Box sx={{ p: 2, pt: 4, display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
                    <Typography variant="caption" fontWeight="bold">9:41</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ width: 15, height: 10, bgcolor: 'white', borderRadius: 0.2 }} />
                      <Box sx={{ width: 10, height: 10, bgcolor: 'white', borderRadius: 5 }} />
                    </Box>
                  </Box>

                  {/* Dynamic Content */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, overflowY: 'auto' }}>
                    {mode === 'idle' && (
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 3 }}>
                        <IconButton 
                          onClick={toggleListening}
                          sx={{ 
                            width: 100, 
                            height: 100, 
                            bgcolor: listening ? 'rgba(211, 47, 47, 0.2)' : 'rgba(46, 125, 50, 0.1)',
                            border: '1px solid',
                            borderColor: listening ? 'error.main' : 'primary.main',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: listening ? 'scale(1.1)' : 'scale(1)',
                          }}
                        >
                          <Mic sx={{ fontSize: 50, color: listening ? 'error.main' : 'primary.main' }} className={listening ? 'animate-pulse' : ''} />
                        </IconButton>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {listening ? 'Listening...' : 'Awaiting Voice...'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {listening ? 'Speak naturally now' : 'Tap the mic or navigation to start'}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {mode === 'chat' && (
                      <>
                        <Box sx={{ flex: 1, mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {messages.map((m, i) => (
                            <Box key={i} sx={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                              <Paper sx={{ 
                                p: 2, 
                                borderRadius: m.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                bgcolor: m.role === 'user' ? 'primary.main' : 'background.paper',
                                border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)'
                              }}>
                                <Typography variant="body2">{m.content}</Typography>
                              </Paper>
                            </Box>
                          ))}
                          {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
                          <div ref={chatEndRef} />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <TextField 
                            fullWidth 
                            size="small" 
                            placeholder="Type or speak..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
                          />
                          <IconButton onClick={toggleListening} color={listening ? "error" : "primary"}>
                            <Mic />
                          </IconButton>
                          <IconButton onClick={() => handleSend()} color="primary" disabled={!input.trim()}>
                            <Send />
                          </IconButton>
                        </Box>
                      </>
                    )}

                    {mode === 'eligibility' && (
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          STEP {currentQ + 1} OF {questions.length}
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4 }}>{questions[currentQ].text}</Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Button variant="contained" size="large" onClick={() => handleAnswer('yes')}>
                            {lang === 'en' ? 'Yes, Correct' : 'ಹೌದು'}
                          </Button>
                          <Button variant="outlined" size="large" onClick={() => handleAnswer('no')}>
                            {lang === 'en' ? 'No, Incorrect' : 'ಇಲ್ಲ'}
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {/* Home Indicator */}
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: 120, height: 5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 10 }} />
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;

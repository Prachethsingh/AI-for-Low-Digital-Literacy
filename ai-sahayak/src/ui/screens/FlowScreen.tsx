import React, { useMemo, useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  LinearProgress, 
  Chip,
  Paper,
  IconButton,
  Stack
} from "@mui/material";
import { 
  VolumeUp, 
  ArrowBack,
  CheckCircle
} from "@mui/icons-material";
import type { Language } from "../../domain/i18n";
import { t } from "../../domain/i18n";
import type { Question, Scheme } from "../../domain/schemes";
import type { Answers } from "../App";
import type { useSpeech } from "../speech/useSpeech";
import { CameraStep } from "../steps/CameraStep";
import { OptionsStep } from "../steps/OptionsStep";
import { YesNoStep } from "../steps/YesNoStep";

type SpeechApi = ReturnType<typeof useSpeech>;

function questionText(lang: Language, q: Question): string {
  return (t(lang, q.textKey as any) as unknown as string) ?? q.textKey;
}

export function FlowScreen(props: {
  lang: Language;
  scheme: Scheme;
  speech: SpeechApi;
  initialAnswers: Answers;
  onBack: () => void;
  onDone: (answers: Answers) => void;
}) {
  const { lang, scheme, speech, initialAnswers, onBack, onDone } = props;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);

  const questions = scheme.questions;
  const total = questions.length;
  const current = questions[index];
  const stepNumber = index + 1;
  const progress = (stepNumber / total) * 100;

  const title = useMemo(() => t(lang, scheme.titleKey as any), [lang, scheme.titleKey]);

  const goNext = () => {
    if (index < questions.length - 1) setIndex((p) => p + 1);
    else onDone(answers);
  };

  const setAnswer = (key: string, value: string | boolean) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const sayQuestion = () => {
    if (!current) return;
    speech.speak(questionText(lang, current));
  };

  if (!current) return null;

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Progress Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
            STEP {stepNumber} OF {total}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      <Chip 
        label={title} 
        size="small" 
        color="primary" 
        variant="outlined"
        sx={{ alignSelf: 'center', mb: 3, fontWeight: 700 }}
      />

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, lineHeight: 1.4 }}>
        {questionText(lang, current)}
      </Typography>

      <Box sx={{ flex: 1 }}>
        {current.type.kind === "yes_no" && (
          <YesNoStep
            lang={lang}
            value={answers[current.id]}
            onPick={(v) => {
              setAnswer(current.id, v);
              goNext();
            }}
          />
        )}

        {current.type.kind === "single_choice" && (
          <OptionsStep
            lang={lang}
            options={current.type.options}
            value={answers[current.id]}
            onPick={(id) => {
              setAnswer(current.id, id);
              goNext();
            }}
          />
        )}

        {current.type.kind === "camera" && (
          <CameraStep
            lang={lang}
            purpose={current.type.purpose}
            onCaptured={(dataUrl) => {
              setAnswer(current.id, dataUrl);
              goNext();
            }}
          />
        )}
      </Box>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />} 
          onClick={onBack}
          sx={{ flex: 1, borderRadius: 3 }}
        >
          {t(lang, "back")}
        </Button>
        <Button 
          variant="contained" 
          startIcon={<VolumeUp />} 
          onClick={sayQuestion}
          sx={{ flex: 1, borderRadius: 3 }}
        >
          {t(lang, "listen")}
        </Button>
      </Stack>
    </Box>
  );
}


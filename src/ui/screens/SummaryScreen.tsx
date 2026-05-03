import React, { useMemo } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
  alpha
} from "@mui/material";
import { Check, Edit } from "@mui/icons-material";
import type { Language } from "../../domain/i18n";
import { t } from "../../domain/i18n";
import type { Scheme } from "../../domain/schemes";
import type { Answers } from "../App";

function humanValue(v: string | boolean | undefined): string {
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (!v) return "-";
  if (v.startsWith("data:image/")) return "📷 Captured";
  return v;
}

export function SummaryScreen(props: {
  lang: Language;
  scheme: Scheme;
  answers: Answers;
  onBack: () => void;
  onContinue: () => void;
}) {
  const { lang, scheme, answers, onBack, onContinue } = props;
  const rows = useMemo(() => {
    return scheme.questions.map((q) => ({
      id: q.id,
      question: (t(lang, q.textKey as any) as unknown as string) || q.textKey,
      value: humanValue(answers[q.id] as any)
    }));
  }, [answers, lang, scheme.questions]);

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
        {t(lang, "summary_title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {t(lang, "confirm")}
      </Typography>

      <Paper elevation={0} sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        borderRadius: 4, 
        border: 1, 
        borderColor: 'divider',
        bgcolor: alpha('#2e7d32', 0.02)
      }}>
        <List disablePadding>
          {rows.map((r, i) => (
            <React.Fragment key={r.id}>
              <ListItem sx={{ py: 2 }}>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
                      {r.question}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ fontWeight: 900, color: 'primary.main' }}>
                      {r.value}
                    </Typography>
                  }
                />
              </ListItem>
              {i < rows.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Stack spacing={2} sx={{ mt: 4 }}>
        <Button 
          variant="contained" 
          size="large" 
          fullWidth 
          startIcon={<Check />}
          onClick={onContinue}
          sx={{ py: 1.5, borderRadius: 3 }}
        >
          {t(lang, "all_correct")}
        </Button>
        <Button 
          variant="outlined" 
          size="large" 
          fullWidth 
          startIcon={<Edit />}
          onClick={onBack}
          sx={{ py: 1.5, borderRadius: 3 }}
        >
          {t(lang, "edit_if_needed")}
        </Button>
      </Stack>
    </Box>
  );
}


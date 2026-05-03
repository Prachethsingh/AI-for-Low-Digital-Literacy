import React from "react";
import { 
  Box, 
  Button, 
  Stack,
  Typography,
  alpha
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import type { Language } from "../../domain/i18n";
import { t } from "../../domain/i18n";

export function OptionsStep(props: {
  lang: Language;
  options: { id: string; icon?: string; labelKey: string }[];
  value?: string | boolean;
  onPick: (id: string) => void;
}) {
  const { lang, options, onPick } = props;
  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      {options.map((o) => (
        <Button
          key={o.id}
          variant="outlined"
          fullWidth
          onClick={() => onPick(o.id)}
          sx={{ 
            p: 2, 
            borderRadius: 4,
            borderColor: 'divider',
            color: 'text.primary',
            justifyContent: 'space-between',
            textTransform: 'none',
            bgcolor: 'background.paper',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: alpha('#2e7d32', 0.05),
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" component="span" sx={{ fontSize: 24 }}>
              {o.icon ?? "•"}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 800 }}>
              {t(lang, o.labelKey as any)}
            </Typography>
          </Box>
          <ArrowForward color="primary" />
        </Button>
      ))}
    </Stack>
  );
}


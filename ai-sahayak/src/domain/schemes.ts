export type SchemeId = "pm_kisan" | "bima";

export type QuestionType =
  | { kind: "yes_no" }
  | { kind: "single_choice"; options: { id: string; icon?: string; labelKey: string }[] }
  | { kind: "camera"; purpose: "aadhaar" | "crop_damage" };

export type Question = {
  id: string;
  textKey: string;
  type: QuestionType;
};

export type Scheme = {
  id: SchemeId;
  titleKey: string;
  subtitleKey: string;
  theme: "green" | "purple";
  questions: Question[];
};

export const schemes: Scheme[] = [
  {
    id: "pm_kisan",
    titleKey: "scheme_pm_kisan",
    subtitleKey: "scheme_pm_kisan_desc",
    theme: "green",
    questions: [
      { id: "farmer", textKey: "q_pm_farmer", type: { kind: "yes_no" } },
      { id: "aadhaar", textKey: "q_pm_aadhaar", type: { kind: "yes_no" } },
      { id: "aadhaar_scan", textKey: "q_pm_aadhaar_scan", type: { kind: "camera", purpose: "aadhaar" } },
      { id: "land_registered", textKey: "q_pm_land_registered", type: { kind: "yes_no" } },
      {
        id: "land_size",
        textKey: "q_pm_land_size",
        type: {
          kind: "single_choice",
          options: [
            { id: "small", icon: "🌱", labelKey: "opt_small" },
            { id: "medium", icon: "🌾", labelKey: "opt_medium" },
            { id: "large", icon: "🌳", labelKey: "opt_large" }
          ]
        }
      },
      { id: "bank", textKey: "q_pm_bank", type: { kind: "yes_no" } },
      { id: "aadhaar_linked", textKey: "q_pm_aadhaar_linked", type: { kind: "yes_no" } },
      { id: "received_before", textKey: "q_pm_received_before", type: { kind: "yes_no" } }
    ]
  },
  {
    id: "bima",
    titleKey: "scheme_bima",
    subtitleKey: "scheme_bima_desc",
    theme: "purple",
    questions: [
      { id: "apply_insurance", textKey: "q_b_apply_insurance", type: { kind: "yes_no" } },
      { id: "growing", textKey: "q_b_growing", type: { kind: "yes_no" } },
      {
        id: "crop",
        textKey: "q_b_crop",
        type: {
          kind: "single_choice",
          options: [
            { id: "rice", icon: "🌾", labelKey: "opt_crop_rice" },
            { id: "wheat", icon: "🌿", labelKey: "opt_crop_wheat" },
            { id: "maize", icon: "🌽", labelKey: "opt_crop_maize" },
            { id: "cotton", icon: "🧶", labelKey: "opt_crop_cotton" },
            { id: "pulses", icon: "🫘", labelKey: "opt_crop_pulses" },
            { id: "other", icon: "➕", labelKey: "opt_other" }
          ]
        }
      },
      {
        id: "land_size",
        textKey: "q_b_land_size",
        type: {
          kind: "single_choice",
          options: [
            { id: "small", icon: "🌱", labelKey: "opt_small" },
            { id: "medium", icon: "🌾", labelKey: "opt_medium" },
            { id: "large", icon: "🌳", labelKey: "opt_large" }
          ]
        }
      },
      { id: "damaged", textKey: "q_b_damaged", type: { kind: "yes_no" } },
      {
        id: "damage_cause",
        textKey: "q_b_damage_cause",
        type: {
          kind: "single_choice",
          options: [
            { id: "flood", icon: "🌊", labelKey: "opt_flood" },
            { id: "drought", icon: "☀️", labelKey: "opt_drought" },
            { id: "pest", icon: "🐛", labelKey: "opt_pest" }
          ]
        }
      },
      { id: "crop_damage_scan", textKey: "q_b_crop_damage_scan", type: { kind: "camera", purpose: "crop_damage" } },
      {
        id: "damage_when",
        textKey: "q_b_damage_when",
        type: {
          kind: "single_choice",
          options: [
            { id: "today", icon: "📅", labelKey: "opt_today" },
            { id: "few_days", icon: "🗓️", labelKey: "opt_few_days" },
            { id: "week_plus", icon: "⏳", labelKey: "opt_week_plus" }
          ]
        }
      },
      { id: "aadhaar", textKey: "q_b_aadhaar", type: { kind: "camera", purpose: "aadhaar" } },
      { id: "submit_claim", textKey: "q_b_submit_claim", type: { kind: "yes_no" } }
    ]
  }
];


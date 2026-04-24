"use client";

import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import {
  alpha,
  Box,
  LinearProgress,
  MobileStepper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import SuccessStep from "@/checkpoint/app/(protected)/create/components/step/SuccessStep";
import CreateEventWizard from "@/checkpoint/app/(protected)/create/CreateEventWizard";
import { CreateEventProvider } from "@/checkpoint/app/(protected)/create/context/CreateEventContext";


export default function CreateEventPage() {


  return (
    <CreateEventProvider>
      <CreateEventWizard />
    </CreateEventProvider>
  );
}

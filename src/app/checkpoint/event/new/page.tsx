"use client";

import { AppleNavBar } from "@/components/apple/AppleNavBar";
import { Alert, Box, Snackbar, Stack } from "@mui/material";
import { JSX, useState } from "react";

import { SlideTransition } from "@/app/checkpoint/(authentication)/register/SlideTransition";
import { CREATE_EVENT } from "@/components/../graphql/event/event-mutation.graphql";
import {
  CreateEventRequest,
  CreateEventResult,
} from "@/components/../types/event/event-mutation-graphql.type";
import { AppleProgress } from "@/components/newEvent/EventSteps.style";
import Step1Basics from "@/components/newEvent/Step1Basics";
import Step2Time from "@/components/newEvent/Step2Time";
import Step3Advanced from "@/components/newEvent/Step3Advanced";
import Step4Summary from "@/components/newEvent/Step4Summary";
import Step5Success from "@/components/newEvent/Step5Success";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";

export default function CreateEventPage(): JSX.Element {
  const router = useRouter();
  const [createdId, setCreatedId] = useState<string | null>(null);

  const [step, setStep] = useState(1);

  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const [form, setForm] = useState({
    name: "",
    maxSeats: 50,
    allowReEntry: true,
    location: "",
    description: "",

    startsAt: "",
    endsAt: "",

    dressCode: "",
    defaultSection: 1,
    defaultTable: 1,
    rotateSeconds: 60,
  });

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  /* -------------------------------------------
   * CREATE MUTATION
   * ------------------------------------------*/
  const [createEvent, { loading }] = useMutation<
    CreateEventResult,
    CreateEventRequest
  >(CREATE_EVENT);

  async function finish(): Promise<void> {
    try {
      const payload = {
        name: form.name.trim(),
        maxSeats: form.maxSeats,
        allowReEntry: form.allowReEntry,
        location: form.location || undefined,
        description: form.description || undefined,

        startsAt: form.startsAt,
        endsAt: form.endsAt,

        dressCode: form.dressCode || undefined,
        defaultSection: form.defaultSection,
        defaultTable: form.defaultTable,
        rotateSeconds: form.rotateSeconds,
      };

      const { data } = await createEvent({ variables: { input: payload } });
      const id = data?.createEvent?.id;
      if (!id) throw new Error("No ID returned");

      setSnack({ open: true, severity: "success", message: "Event erstellt!" });

      setCreatedId(id);
      setStep(5);
    } catch (err) {
      setSnack({
        open: true,
        severity: "error",
        message: "Fehler beim Erstellen.",
      });
    }
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 600, mx: "auto" }}>
      <AppleNavBar title="Neues Event" onBack={() => router.push("/event")} />

      <AppleProgress step={step} total={5} />

      <Stack spacing={4} mt={4}>
        <SlideTransition step={step}>
          <>
            {step === 1 && (
              <Step1Basics form={form} update={update} onNext={next} />
            )}

            {step === 2 && (
              <Step2Time
                form={form}
                update={update}
                onNext={next}
                onBack={back}
              />
            )}

            {step === 3 && (
              <Step3Advanced
                form={form}
                update={update}
                onBack={back}
                onNext={next}
                loading={loading}
              />
            )}

            {step === 4 && (
              <Step4Summary
                form={form}
                onBack={back}
                onFinish={finish}
                loading={loading}
              />
            )}

            {step === 5 && (
              <Step5Success
                eventId={createdId!}
                onDone={() => router.push(`/event/${createdId}`)}
              />
            )}
          </>
        </SlideTransition>
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snack.severity as any}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}

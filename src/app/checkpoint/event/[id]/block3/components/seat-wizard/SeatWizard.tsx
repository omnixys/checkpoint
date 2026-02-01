"use client";

import React from "react";
import { Box, Button, Stepper, Step, StepLabel } from "@mui/material";
import { gql  } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

import StepSections from "./steps/StepSections";
import StepTables from "./steps/StepTables";
import StepSeats from "./steps/StepSeats";
import StepShapes from "./steps/StepShapes";
import StepReview from "./steps/StepReview";

import { WizardData, emptyWizardData } from "./types";

const AUTO_GENERATE = gql`
  mutation AutoGenerateLayout($input: AutoGenerateLayoutInput!) {
    autoGenerateLayout(input: $input)
  }
`;

const steps = ["Bereiche", "Tische", "Sitzplätze", "Formen", "Übersicht"];

export default function SeatWizard({ eventId, onFinished }) {
  const [active, setActive] = React.useState(0);

  // the full wizard state
  const [data, setData] = React.useState<WizardData>(emptyWizardData);

  const [runGenerate, { loading }] = useMutation(AUTO_GENERATE);

  const next = () => setActive((s) => s + 1);
  const back = () => setActive((s) => s - 1);

  const submit = async () => {
    await runGenerate({
      variables: {
        input: {
          eventId,
          sections: data.sections,
          adaptiveRadius: true,
        },
      },
    });

    onFinished?.();
  };

  const StepContent = [
    <StepSections data={data} setData={setData} next={next} />,
    <StepTables data={data} setData={setData} next={next} back={back} />,
    <StepSeats data={data} setData={setData} next={next} back={back} />,
    <StepShapes data={data} setData={setData} next={next} back={back} />,
    <StepReview data={data} back={back} submit={submit} loading={loading} />,
  ][active];

  return (
    <Box>
      {/* Stepper */}
      <Stepper activeStep={active} sx={{ mb: 3 }}>
        {steps.map((s) => (
          <Step key={s}>
            <StepLabel>{s}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Box>{StepContent}</Box>
    </Box>
  );
}

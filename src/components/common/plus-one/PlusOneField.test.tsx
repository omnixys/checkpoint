import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PhoneNumberInput } from "@/checkpoint/generated/graphql";
import { PhoneNumberType } from "@/checkpoint/generated/graphql";
import type { NormalizedPlusOne } from "@/checkpoint/types/event.type";
import commonEn from "../../../../messages/en/common.json";
import PlusOneField from "./PlusOneField";

function phone(overrides: Partial<PhoneNumberInput> = {}): PhoneNumberInput {
  return {
    type: PhoneNumberType.WHATSAPP,
    number: "",
    label: "",
    countryCode: "+49",
    isPrimary: true,
    ...overrides,
  };
}

function makePlusOne(overrides: Partial<NormalizedPlusOne> = {}): NormalizedPlusOne {
  return {
    firstName: "Ada",
    lastName: "Lovelace",
    email: null,
    plusOneAgeCategory: "OVER_SIX",
    guestNote: null,
    phoneNumbers: [phone()],
    ...overrides,
  } as unknown as NormalizedPlusOne;
}

function Controlled({ initial }: { initial: NormalizedPlusOne }) {
  const [value, setValue] = useState(initial);

  const updatePhone = (
    _index: number,
    phoneIndex: number,
    field: keyof PhoneNumberInput,
    val: PhoneNumberInput[keyof PhoneNumberInput],
  ) => {
    setValue((prev) => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((p, idx) =>
        idx === phoneIndex ? ({ ...p, [field]: val } as PhoneNumberInput) : p,
      ),
    }));
  };

  return (
    <PlusOneField
      value={value}
      index={0}
      countries={[]}
      onChange={vi.fn()}
      onRemove={vi.fn()}
      onAddPhone={vi.fn()}
      onUpdatePhone={(index, phoneIndex, field, val) => updatePhone(index, phoneIndex, field, val)}
      onRemovePhone={vi.fn()}
    />
  );
}

function renderWithI18n(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider messages={{ common: commonEn }} locale="en">
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("PlusOneField", () => {
  afterEach(cleanup);

  it("keeps the focused input mounted while typing a plus-one phone number", () => {
    renderWithI18n(<Controlled initial={makePlusOne()} />);

    const input = screen.getByLabelText("Phone number") as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);

    fireEvent.change(input, { target: { value: "1" } });
    const afterFirst = screen.getByLabelText("Phone number");
    expect(afterFirst).toBe(input);
    expect(document.activeElement).toBe(input);
    expect((afterFirst as HTMLInputElement).value).toBe("1");

    fireEvent.change(input, { target: { value: "17" } });
    const afterSecond = screen.getByLabelText("Phone number");
    expect(afterSecond).toBe(input);
    expect(document.activeElement).toBe(input);
    expect((afterSecond as HTMLInputElement).value).toBe("17");
  });
});

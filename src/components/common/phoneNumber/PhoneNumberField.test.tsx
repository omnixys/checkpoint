import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PhoneNumberInput } from "@/checkpoint/generated/graphql";
import { PhoneNumberType } from "@/checkpoint/generated/graphql";
import PhoneNumberField from "./PhoneNumberField";

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

describe("PhoneNumberField", () => {
  afterEach(cleanup);

  it("strips non-digit characters from the phone number input", () => {
    const onChange = vi.fn();
    render(
      <PhoneNumberField
        value={phone()}
        index={0}
        countries={[]}
        onChange={onChange}
        onRemove={vi.fn()}
      />,
    );

    const input = screen.getByLabelText("Phone number") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "176 123-4567(8)" } });

    expect(onChange).toHaveBeenCalledWith(0, "number", "17612345678");
  });
});

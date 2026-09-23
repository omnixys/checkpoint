import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
  CreatePlusOneInput,
  InvitationPayload,
  UpdatePlusOneInput,
} from "@/checkpoint/generated/graphql";
import { InvitationStatus, PhoneNumberType } from "@/checkpoint/generated/graphql";
import commonEn from "../../../../messages/en/common.json";
import invitationEn from "../../../../messages/en/invitation.json";
import InvitationPlusOneSection from "./InvitationPlusOneSection";

const { createPlusOneMutation, updatePlusOneMutation, removePlusOneMutation } = vi.hoisted(() => ({
  createPlusOneMutation: vi.fn(),
  updatePlusOneMutation: vi.fn(),
  removePlusOneMutation: vi.fn(),
}));

const enqueueSnackbar = vi.hoisted(() => vi.fn());

vi.mock("@/checkpoint/hooks/invitation/useInvitationMutation", () => ({
  default: () => ({
    createPlusOneMutation,
    updatePlusOneMutation,
    removePlusOneMutation,
  }),
}));

vi.mock("notistack", () => ({
  useSnackbar: () => ({ enqueueSnackbar }),
}));

function makeInvitation(overrides: Partial<InvitationPayload> = {}): InvitationPayload {
  return {
    __typename: "InvitationPayload",
    id: "inv-1",
    eventId: "event-1",
    eventName: "Wedding",
    firstName: "Jane",
    lastName: "Doe",
    maxInvitees: 2,
    plusOnes: [],
    phoneNumbers: [],
    status: InvitationStatus.APPROVED,
    ...overrides,
  } as unknown as InvitationPayload;
}

function renderWithI18n(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider messages={{ invitation: invitationEn, common: commonEn }} locale="en">
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("InvitationPlusOneSection", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing without the manage plus-ones permission", () => {
    const { container } = renderWithI18n(
      <InvitationPlusOneSection
        invitation={makeInvitation()}
        canManage={false}
        onChanged={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows remaining capacity and an empty state", () => {
    renderWithI18n(
      <InvitationPlusOneSection
        invitation={makeInvitation({ maxInvitees: 3 })}
        canManage={true}
        onChanged={vi.fn()}
      />,
    );
    expect(screen.getByText("Remaining slots: 3")).toBeInTheDocument();
    expect(screen.getByText("No plus-ones yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add guest" })).toBeEnabled();
  });

  it("disables adding when no plus-one capacity remains", () => {
    renderWithI18n(
      <InvitationPlusOneSection
        invitation={makeInvitation({ maxInvitees: 0 })}
        canManage={true}
        onChanged={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Add guest" })).toBeDisabled();
  });

  it("creates a plus-one against the parent invitation and event", async () => {
    createPlusOneMutation.mockResolvedValue({});
    const onChanged = vi.fn();

    renderWithI18n(
      <InvitationPlusOneSection
        invitation={makeInvitation({ maxInvitees: 2 })}
        canManage={true}
        onChanged={onChanged}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Add guest" }));

    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Max" } });
    fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Mustermann" } });
    fireEvent.click(screen.getByRole("radio", { name: "Over 6" }));

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => expect(createPlusOneMutation).toHaveBeenCalledTimes(1));

    const input = createPlusOneMutation.mock.calls[0]![0].variables.input as CreatePlusOneInput;
    expect(input).toMatchObject({
      eventId: "event-1",
      invitedByInvitationId: "inv-1",
      firstName: "Max",
      lastName: "Mustermann",
      plusOneAgeCategory: "OVER_SIX",
    });
    expect(onChanged).toHaveBeenCalled();
    expect(enqueueSnackbar).toHaveBeenCalledWith("Plus-one has been added.", expect.anything());
  });

  it("prefills the parent email and phone when adding a plus-one as staff", async () => {
    createPlusOneMutation.mockResolvedValue({});
    const onChanged = vi.fn();

    renderWithI18n(
      <InvitationPlusOneSection
        invitation={makeInvitation({
          email: "jane@example.com",
          phoneNumbers: [
            {
              __typename: "PhoneNumberPayload",
              id: "ph-1",
              infoId: "parent-1",
              createdAt: "2026-01-01T00:00:00.000Z",
              updatedAt: "2026-01-01T00:00:00.000Z",
              countryCode: "+49",
              number: "017012345678",
              type: PhoneNumberType.MOBILE,
              label: "Mobile",
              isPrimary: true,
            },
          ],
        })}
        canManage={true}
        onChanged={onChanged}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Add guest" }));

    expect(screen.getByLabelText("Email")).toHaveValue("jane@example.com");
    expect(screen.getByLabelText("Country code")).toHaveValue("+49");
    expect(screen.getByLabelText("Phone number")).toHaveValue("017012345678");

    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Lena" } });
    fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Müller" } });
    fireEvent.click(screen.getByRole("radio", { name: "Over 6" }));
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => expect(createPlusOneMutation).toHaveBeenCalledTimes(1));

    const input = createPlusOneMutation.mock.calls[0]![0].variables.input as CreatePlusOneInput;
    expect(input).toMatchObject({
      email: "jane@example.com",
      phoneNumbers: [{ countryCode: "+49", number: "017012345678", isPrimary: true }],
    });
    expect(onChanged).toHaveBeenCalled();
  });

  it("prefills the parent phone from the legacy phoneNumber string when no structured numbers exist", async () => {
    createPlusOneMutation.mockResolvedValue({});
    const onChanged = vi.fn();

    renderWithI18n(
      <InvitationPlusOneSection
        invitation={makeInvitation({
          email: "jane@example.com",
          phoneNumber: "+4917987654321",
          phoneNumbers: [],
        })}
        canManage={true}
        onChanged={onChanged}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Add guest" }));

    expect(screen.getByLabelText("Email")).toHaveValue("jane@example.com");
    expect(screen.getByLabelText("Country code")).toHaveValue("+49");
    expect(screen.getByLabelText("Phone number")).toHaveValue("17987654321");
  });

  it("updates an existing plus-one keeping its id", async () => {
    updatePlusOneMutation.mockResolvedValue({});
    const onChanged = vi.fn();

    const plusOne = makeInvitation({
      id: "po-1",
      firstName: "Max",
      lastName: "Mustermann",
      maxInvitees: 0,
      status: InvitationStatus.PENDING,
    });

    renderWithI18n(
      <InvitationPlusOneSection
        invitation={makeInvitation({ plusOnes: [plusOne] })}
        canManage={true}
        onChanged={onChanged}
      />,
    );

    expect(screen.getByText("Max Mustermann")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Edit plus-one" }));

    fireEvent.click(screen.getByRole("radio", { name: "Under 6" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(updatePlusOneMutation).toHaveBeenCalledTimes(1));

    const input = updatePlusOneMutation.mock.calls[0]![0].variables.input as UpdatePlusOneInput;
    expect(input.id).toBe("po-1");
    expect(input.firstName).toBe("Max");
    expect(input.plusOneAgeCategory).toBe("UNDER_SIX");
    expect(onChanged).toHaveBeenCalled();
  });

  it("removes a plus-one by its id", async () => {
    removePlusOneMutation.mockResolvedValue({});
    const onChanged = vi.fn();

    const plusOne = makeInvitation({
      id: "po-2",
      firstName: "Max",
      lastName: "Mustermann",
      maxInvitees: 0,
      status: InvitationStatus.PENDING,
    });

    renderWithI18n(
      <InvitationPlusOneSection
        invitation={makeInvitation({ plusOnes: [plusOne] })}
        canManage={true}
        onChanged={onChanged}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete plus-one" }));

    await waitFor(() => expect(removePlusOneMutation).toHaveBeenCalledTimes(1));
    expect(removePlusOneMutation).toHaveBeenCalledWith({ variables: { id: "po-2" } });
    expect(onChanged).toHaveBeenCalled();
    expect(enqueueSnackbar).toHaveBeenCalledWith("Plus-one has been removed.", expect.anything());
  });
});

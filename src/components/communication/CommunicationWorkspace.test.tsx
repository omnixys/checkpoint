import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAppTheme } from "@/checkpoint/themes/createAppTheme";
import layoutEn from "../../../messages/en/layout.json";
import { type CommunicationDataSource, CommunicationWorkspace } from "./CommunicationWorkspace";
import type { PersonData } from "./PersonListItem";

const conversations: CommunicationDataSource["conversations"] = [
  {
    id: "conv-1",
    channel: "WHATSAPP",
    name: "Lena Müller",
    contact: "whatsapp:+491700000001",
    preview: "Can I bring a plus one?",
    updatedAt: "14:02",
    unreadCount: 2,
    status: "OPEN",
    audience: "DIRECT",
    eventLabel: "event-1",
    details: [{ label: "Status", value: "OPEN" }],
  },
  {
    id: "conv-2",
    channel: "IN_APP",
    name: "Jonas Weber",
    contact: "jonas@example.com",
    preview: "Thanks for the update",
    updatedAt: "09:11",
    unreadCount: 0,
    status: "CLOSED",
    audience: "DIRECT",
    eventLabel: "event-1",
  },
  {
    id: "conv-3",
    channel: "EMAIL",
    name: "Ema Kowalski",
    contact: "ema@example.com",
    preview: "Dietary requirements",
    updatedAt: "Mon",
    unreadCount: 1,
    status: "WAITING",
    audience: "DIRECT",
    eventLabel: "event-1",
  },
];

const messages: CommunicationDataSource["messages"] = [
  {
    id: "m-1",
    body: "Hello, I have a question.",
    createdAt: "13:58",
    outgoing: false,
    sender: "Guest",
  },
  { id: "m-2", body: "Sure, how can we help?", createdAt: "14:00", outgoing: true, sender: "You" },
];

const staff: PersonData[] = [
  {
    id: "staff-1",
    name: "Lena Müller",
    roles: ["Ops"],
    channels: ["IN_APP"],
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: "staff-2",
    name: "Jonas Weber",
    roles: ["Security"],
    channels: ["IN_APP"],
    isOnline: false,
    unreadCount: 0,
  },
];

function baseDataSource(overrides: Partial<CommunicationDataSource> = {}): CommunicationDataSource {
  return {
    conversations,
    selectedId: null,
    onSelect: vi.fn(),
    messages,
    onSend: vi.fn().mockResolvedValue(undefined),
    loading: false,
    error: null,
    capabilities: { send: true },
    ...overrides,
  };
}

function renderWorkspace(
  workspace: "support" | "messages",
  dataSource: CommunicationDataSource = baseDataSource(),
) {
  return render(
    <ThemeProvider theme={createAppTheme("light")}>
      <NextIntlClientProvider messages={{ layout: layoutEn }} locale="en">
        <CommunicationWorkspace workspace={workspace} dataSource={dataSource} />
      </NextIntlClientProvider>
    </ThemeProvider>,
  );
}

describe("CommunicationWorkspace", () => {
  afterEach(cleanup);

  it("lists conversations with a count", () => {
    renderWorkspace("support");

    expect(screen.getByRole("heading", { name: "Support" })).toBeInTheDocument();
    expect(screen.getByText("Lena Müller")).toBeInTheDocument();
    expect(screen.getByText("Jonas Weber")).toBeInTheDocument();
    expect(screen.getByText("Ema Kowalski")).toBeInTheDocument();
    expect(screen.getByText("3 conversations")).toBeInTheDocument();
  });

  it("filters the inbox by search term", () => {
    renderWorkspace("support");

    fireEvent.change(screen.getByLabelText("Search conversations"), {
      target: { value: "lena" },
    });

    expect(screen.getByText("Lena Müller")).toBeInTheDocument();
    expect(screen.queryByText("Jonas Weber")).not.toBeInTheDocument();
  });

  it("reports the selection through onSelect", () => {
    const onSelect = vi.fn();
    renderWorkspace("support", baseDataSource({ onSelect }));

    fireEvent.click(screen.getByRole("button", { name: /Lena Müller/ }));

    expect(onSelect).toHaveBeenCalledWith("conv-1");
  });

  it("renders incoming and outgoing messages in the open conversation", () => {
    renderWorkspace("support", baseDataSource({ selectedId: "conv-1" }));

    expect(screen.getByText("Hello, I have a question.")).toBeInTheDocument();
    expect(screen.getByText("Sure, how can we help?")).toBeInTheDocument();
    expect(screen.getByTestId("communication-message-m-1")).toHaveStyle({
      alignSelf: "flex-start",
    });
    expect(screen.getByTestId("communication-message-m-2")).toHaveStyle({
      alignSelf: "flex-end",
    });
  });

  it("keeps the newest outgoing message in view", () => {
    const originalScrollHeight = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollHeight",
    );
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      get: () => 480,
    });

    try {
      renderWorkspace("support", baseDataSource({ selectedId: "conv-1" }));

      expect(screen.getByTestId("communication-timeline").scrollTop).toBe(480);
    } finally {
      if (originalScrollHeight) {
        Object.defineProperty(HTMLElement.prototype, "scrollHeight", originalScrollHeight);
      }
    }
  });

  it("sends the draft via onSend and clears the composer", () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    renderWorkspace("support", baseDataSource({ selectedId: "conv-1", onSend }));

    fireEvent.change(screen.getByLabelText("Write a message"), {
      target: { value: "One more question" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(onSend).toHaveBeenCalledWith("One more question");
    expect(screen.queryByDisplayValue("One more question")).not.toBeInTheDocument();
  });

  it("disables the composer when sending is not supported", () => {
    renderWorkspace(
      "messages",
      baseDataSource({ selectedId: "conv-1", capabilities: { send: false } }),
    );

    expect(screen.getByLabelText("Write a message")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("shows a loading state before conversations arrive", () => {
    renderWorkspace("support", baseDataSource({ conversations: [], messages: [], loading: true }));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("surfaces a data source error instead of the inbox", () => {
    renderWorkspace(
      "support",
      baseDataSource({ conversations: [], messages: [], error: "Backend unreachable" }),
    );

    expect(screen.getByText("Backend unreachable")).toBeInTheDocument();
    expect(screen.queryByText("Lena Müller")).not.toBeInTheDocument();
  });

  it("shows an empty state when no conversations match", () => {
    renderWorkspace("support", baseDataSource({ conversations: [], messages: [] }));

    expect(screen.getByText("No conversations match these filters.")).toBeInTheDocument();
  });

  it("renders role/audience filters for the internal messages workspace", () => {
    renderWorkspace("messages", baseDataSource({ conversations, selectedId: "conv-1" }));

    expect(screen.getByRole("heading", { name: "Messages" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Broadcast" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Role" })).toBeInTheDocument();
  });

  it("shows the details column with conversation metadata on desktop", () => {
    renderWorkspace("support", baseDataSource({ selectedId: "conv-1" }));

    expect(screen.getAllByText("Lena Müller")).toHaveLength(3);
    expect(screen.getAllByText("whatsapp:+491700000001")).toHaveLength(2);
    expect(screen.getAllByText("OPEN")).toHaveLength(2);
  });

  it("opens the details drawer on tablet via the info button", () => {
    stubMatchMedia(
      (query) =>
        query === "(min-width: 768px) and (max-width: 1279.95px)" || query === "(min-width:900px)",
    );
    renderWorkspace("support", baseDataSource({ selectedId: "conv-1" }));

    fireEvent.click(screen.getByRole("button", { name: "Details" }));

    expect(screen.getByRole("button", { name: "Close details" })).toBeInTheDocument();
  });

  it("offers a new conversation flow in the messages workspace", async () => {
    const onCreateConversation = vi.fn().mockResolvedValue("conv-new");
    renderWorkspace(
      "messages",
      baseDataSource({
        conversations: [],
        staff,
        onCreateConversation,
        capabilities: { send: true, create: true },
      }),
    );

    expect(screen.getByRole("button", { name: "New conversation" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "New conversation" }));

    expect(screen.getByRole("heading", { name: "Select staff" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start conversation" })).toBeDisabled();

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Lena" } });
    fireEvent.click(screen.getByRole("option", { name: /Lena Müller/ }));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Jonas" } });
    fireEvent.click(screen.getByRole("option", { name: /Jonas Weber/ }));

    fireEvent.click(screen.getByRole("button", { name: "Start conversation" }));

    expect(onCreateConversation).toHaveBeenCalledWith(["staff-1", "staff-2"]);
    await waitFor(() =>
      expect(screen.queryByRole("heading", { name: "Select staff" })).not.toBeInTheDocument(),
    );
  });

  it("keeps the start button disabled until at least one staff member is chosen", async () => {
    const onCreateConversation = vi.fn().mockResolvedValue("conv-new");
    renderWorkspace(
      "messages",
      baseDataSource({
        conversations: [],
        staff,
        onCreateConversation,
        capabilities: { send: true, create: true },
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "New conversation" }));

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Lena" } });
    fireEvent.click(screen.getByRole("option", { name: /Lena Müller/ }));

    expect(screen.getByRole("button", { name: "Start conversation" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Start conversation" }));
    expect(onCreateConversation).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() =>
      expect(screen.queryByRole("heading", { name: "Select staff" })).not.toBeInTheDocument(),
    );
  });

  it("does not offer the new conversation flow in the support workspace", () => {
    renderWorkspace("support", baseDataSource({ staff, onCreateConversation: vi.fn() }));

    expect(screen.queryByRole("button", { name: "New conversation" })).not.toBeInTheDocument();
  });

  it("hides the new conversation button when creation is not supported", () => {
    renderWorkspace(
      "messages",
      baseDataSource({ conversations: [], staff, onCreateConversation: vi.fn() }),
    );

    expect(screen.queryByRole("button", { name: "New conversation" })).not.toBeInTheDocument();
  });

  it("surfaces a failure when creating the conversation returns no id", async () => {
    renderWorkspace(
      "messages",
      baseDataSource({
        conversations: [],
        staff,
        onCreateConversation: vi.fn().mockResolvedValue(null),
        capabilities: { send: true, create: true },
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "New conversation" }));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Lena" } });
    fireEvent.click(screen.getByRole("option", { name: /Lena Müller/ }));
    fireEvent.click(screen.getByRole("button", { name: "Start conversation" }));

    expect(
      await screen.findByText("The conversation could not be created. Please try again."),
    ).toBeInTheDocument();
  });
});

function stubMatchMedia(handler: (query: string) => boolean): void {
  const original = window.matchMedia;
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: handler(query),
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: original,
    });
  });
}

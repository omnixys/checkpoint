import { renderHook } from "@testing-library/react";
import { createElement, isValidElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type NavItem, withNavigationBadge } from "@/checkpoint/lib/experience/navigation-builder";
import { useSupportNavigationUnread } from "./useSupportNavigationUnread";

const apollo = vi.hoisted(() => ({
  conversations: [{ unreadCount: 2 }, { unreadCount: 3 }],
  eventChange: undefined as { conversationId: string } | undefined,
  queryOptions: undefined as { skip?: boolean } | undefined,
  subscriptionOptions: undefined as { skip?: boolean } | undefined,
  refetch: vi.fn().mockResolvedValue({ data: {} }),
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: (_document: unknown, options: { skip?: boolean }) => {
    apollo.queryOptions = options;
    return {
      data: { supportConversationsByEvent: apollo.conversations },
      refetch: apollo.refetch,
    };
  },
  useSubscription: (_document: unknown, options: { skip?: boolean }) => {
    apollo.subscriptionOptions = options;
    return {
      data: apollo.eventChange ? { eventConversationsChanged: apollo.eventChange } : undefined,
    };
  },
}));

describe("support navigation unread badge", () => {
  beforeEach(() => {
    apollo.conversations = [{ unreadCount: 2 }, { unreadCount: 3 }];
    apollo.eventChange = undefined;
    apollo.queryOptions = undefined;
    apollo.subscriptionOptions = undefined;
    apollo.refetch.mockClear();
  });

  it("sums unread support conversations and refetches on a realtime event", () => {
    const { result, rerender } = renderHook(() => useSupportNavigationUnread("event-1"));

    expect(result.current).toBe(5);

    apollo.eventChange = { conversationId: "conversation-1" };
    rerender();

    expect(apollo.refetch).toHaveBeenCalledTimes(1);
  });

  it("does not query or subscribe without support access", () => {
    const { result } = renderHook(() => useSupportNavigationUnread("event-1", false));

    expect(result.current).toBe(0);
    expect(apollo.queryOptions?.skip).toBe(true);
    expect(apollo.subscriptionOptions?.skip).toBe(true);
  });

  it("uses the active theme colors for the support notification bubble", () => {
    const item: NavItem = {
      label: "Support",
      icon: createElement("span"),
      path: "/event/event-1/support",
      tourId: "sidebar.support",
      groupId: "event",
    };

    const [decorated] = withNavigationBadge([item], "sidebar.support", 5);

    expect(isValidElement(decorated?.icon)).toBe(true);
    const props = decorated?.icon.props as {
      badgeContent: number;
      sx: { "& .MuiBadge-badge": { backgroundColor: string; color: string } };
    };
    expect(props.badgeContent).toBe(5);
    expect(props.sx["& .MuiBadge-badge"].backgroundColor).toBe("primary.main");
    expect(props.sx["& .MuiBadge-badge"].color).toBe("primary.contrastText");
  });
});

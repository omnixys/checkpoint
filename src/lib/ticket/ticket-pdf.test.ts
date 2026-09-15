import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { deliverPdfBlob, GUEST_CREDENTIALS_FILENAME, isCoarsePointerDevice } from "./ticket-pdf";

describe("isCoarsePointerDevice", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false on a fine-pointer environment", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false })),
    );
    Object.defineProperty(window.navigator, "maxTouchPoints", {
      configurable: true,
      value: 0,
    });

    expect(isCoarsePointerDevice()).toBe(false);
  });

  it("returns true for a coarse pointer", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true })),
    );

    expect(isCoarsePointerDevice()).toBe(true);
  });

  it("returns true when the device reports touch points", () => {
    Object.defineProperty(window.navigator, "maxTouchPoints", {
      configurable: true,
      value: 5,
    });

    expect(isCoarsePointerDevice()).toBe(true);
  });
});

describe("deliverPdfBlob", () => {
  let click: ReturnType<typeof vi.spyOn>;
  let open: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      writable: true,
      value: vi.fn(() => "blob:test-ticket"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
    click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    open = vi.spyOn(window, "open").mockReturnValue({} as Window);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("triggers an anchor download on desktop and returns 'download'", () => {
    const blob = new Blob(["guest"], { type: "application/pdf" });

    const delivery = deliverPdfBlob(blob, false);

    expect(delivery).toBe("download");
    expect(click).toHaveBeenCalledOnce();

    const anchor = click.mock.contexts[0] as HTMLAnchorElement;
    expect(anchor.href).toBe("blob:test-ticket");
    expect(anchor.download).toBe(GUEST_CREDENTIALS_FILENAME);
    expect(document.querySelectorAll("a")).toHaveLength(0);
  });

  it("opens the pdf in a new tab on mobile and returns 'new-tab'", () => {
    const delivery = deliverPdfBlob(new Blob(), true);

    expect(delivery).toBe("new-tab");
    expect(open).toHaveBeenCalledOnce();
    expect(open).toHaveBeenCalledWith("blob:test-ticket", "_blank", "noopener");
    expect(click).not.toHaveBeenCalled();
  });

  it("returns null without a same-tab download when the popup is blocked", () => {
    open.mockReturnValue(null);

    const delivery = deliverPdfBlob(new Blob(), true);

    expect(delivery).toBeNull();
    expect(click).not.toHaveBeenCalled();
  });

  it("revokes the object URL only after the viewer had time to load", () => {
    const revoke = URL.revokeObjectURL as ReturnType<typeof vi.fn>;

    deliverPdfBlob(new Blob(), false);

    expect(revoke).not.toHaveBeenCalled();
    vi.advanceTimersByTime(60_000);
    expect(revoke).toHaveBeenCalledWith("blob:test-ticket");
  });
});

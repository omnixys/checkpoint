import { describe, expect, it, vi } from "vitest";
import { AppError, ErrorCode } from "./app-error";
import { NotificationService } from "./notification.service";

describe("NotificationService", () => {
  it("queues early notifications and delivers them to the first subscriber", () => {
    const service = new NotificationService();
    service.capture(
      new AppError({ code: ErrorCode.INVALID_CREDENTIALS, message: "Invalid credentials" }),
    );
    const listener = vi.fn();
    service.subscribe(listener);

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]?.[0].actions[0]).toMatchObject({ type: "toast" });
  });

  it("deduplicates the same global failure", () => {
    const service = new NotificationService();
    const listener = vi.fn();
    service.subscribe(listener);
    const error = new AppError({
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      message: "Rate limited",
      requestId: "request-1",
      operationName: "Events",
    });

    service.capture(error, { scope: "global" });
    service.capture(error, { scope: "global" });

    expect(listener).toHaveBeenCalledOnce();
  });
});

import { describe, expect, it } from "vitest";
import { ScanVerdict } from "@/checkpoint/generated/graphql";
import {
  cameraFailureReason,
  POLICY_VERDICTS,
  scanReason,
  scanRequestFailureReason,
  scanStatus,
} from "@/checkpoint/utils/scan-verdict";

describe("scanReason", () => {
  it.each([
    [ScanVerdict.OK, "OK"],
    [ScanVerdict.REVOKED, "TICKET_REVOKED"],
    [ScanVerdict.DEVICE_MISMATCH, "DEVICE_MISMATCH"],
    [ScanVerdict.ALREADY_INSIDE, "ALREADY_INSIDE"],
    [ScanVerdict.NOT_INSIDE, "NOT_INSIDE"],
    [ScanVerdict.EXPIRED_EVENT, "EXPIRED_EVENT"],
    [ScanVerdict.INVALID_NONCE, "INVALID_QR"],
    [ScanVerdict.REPLAY, "INVALID_QR"],
    [ScanVerdict.BLOCKED, "INVALID_QR"],
    [ScanVerdict.UNKNOWN, "INVALID_QR"],
  ])("maps verdict %s to reason %s", (verdict, expected) => {
    expect(scanReason(verdict)).toBe(expected);
  });
});

describe("scanStatus", () => {
  it("marks valid scans as SUCCESS", () => {
    expect(scanStatus(ScanVerdict.OK)).toBe("SUCCESS");
  });

  it.each([ScanVerdict.ALREADY_INSIDE, ScanVerdict.NOT_INSIDE, ScanVerdict.EXPIRED_EVENT])(
    "marks policy verdicts (%s) as WARNING so staff can route the guest",
    (verdict) => {
      expect(scanStatus(verdict)).toBe("WARNING");
      expect(POLICY_VERDICTS.has(verdict)).toBe(true);
    },
  );

  it.each([
    ScanVerdict.REVOKED,
    ScanVerdict.DEVICE_MISMATCH,
    ScanVerdict.REPLAY,
    ScanVerdict.BLOCKED,
  ])("marks invalid verdicts (%s) as ERROR", (verdict) => {
    expect(scanStatus(verdict)).toBe("ERROR");
  });
});

describe("scan failure reasons", () => {
  it.each([
    ["NotAllowedError", "CAMERA_PERMISSION_DENIED"],
    ["SecurityError", "CAMERA_PERMISSION_DENIED"],
    ["NotFoundError", "CAMERA_UNAVAILABLE"],
    ["OverconstrainedError", "CAMERA_UNAVAILABLE"],
    ["NotReadableError", "CAMERA_IN_USE"],
  ] as const)("maps camera error %s to %s", (name, expected) => {
    expect(cameraFailureReason(new DOMException("camera error", name))).toBe(expected);
  });

  it("keeps request failures actionable without exposing their raw message", () => {
    expect(scanRequestFailureReason(new Error("connection reset by peer"))).toBe("NETWORK_ERROR");
    expect(scanRequestFailureReason(new Error("unexpected server response"))).toBe(
      "UNEXPECTED_ERROR",
    );
  });
});

import { describe, expect, it } from "vitest";
import { ScanVerdict } from "@/checkpoint/generated/graphql";
import { POLICY_VERDICTS, scanReason, scanStatus } from "@/checkpoint/utils/scan-verdict";

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

  it.each([ScanVerdict.REVOKED, ScanVerdict.DEVICE_MISMATCH, ScanVerdict.REPLAY, ScanVerdict.BLOCKED])(
    "marks invalid verdicts (%s) as ERROR",
    (verdict) => {
      expect(scanStatus(verdict)).toBe("ERROR");
    },
  );
});
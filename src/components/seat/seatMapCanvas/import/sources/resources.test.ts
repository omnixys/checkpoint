import { describe, expect, it, vi } from "vitest";
import { CameraSession, ObjectUrls } from "./resources";

function stream() {
  const stop = vi.fn();
  return { value: { getTracks: () => [{ stop }] } as unknown as MediaStream, stop };
}

describe("temporary source resources", () => {
  it("stops a late camera stream when the dialog closed while permission was pending", async () => {
    const camera = new CameraSession();
    const received = stream();
    let grant: (value: MediaStream) => void = () => undefined;
    const pending = camera.start(
      () =>
        new Promise((resolve) => {
          grant = resolve;
        }),
    );
    camera.stop();
    grant(received.value);
    expect(await pending).toBeNull();
    expect(received.stop).toHaveBeenCalledOnce();
  });

  it("releases active tracks when a new source replaces the camera", async () => {
    const camera = new CameraSession();
    const first = stream();
    const second = stream();
    const access = vi.fn().mockResolvedValueOnce(first.value).mockResolvedValueOnce(second.value);
    expect(await camera.start(access)).toBe(first.value);
    expect(access).toHaveBeenCalledWith({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });
    await camera.start(access);
    expect(first.stop).toHaveBeenCalledOnce();
    camera.stop();
    camera.stop();
    expect(second.stop).toHaveBeenCalledOnce();
  });

  it("propagates permission failure without retaining a stream", async () => {
    const camera = new CameraSession();
    await expect(
      camera.start(() => Promise.reject(new DOMException("Denied", "NotAllowedError"))),
    ).rejects.toThrow("Denied");
    expect(() => camera.stop()).not.toThrow();
  });

  it("revokes previews exactly once on replace and dispose", () => {
    const create = vi.fn().mockReturnValueOnce("blob:first").mockReturnValueOnce("blob:second");
    const revoke = vi.fn();
    vi.stubGlobal("URL", { createObjectURL: create, revokeObjectURL: revoke });
    try {
      const resources = new ObjectUrls();
      const first = resources.create(new Blob());
      resources.create(new Blob());
      resources.revoke(first);
      resources.dispose();
      resources.dispose();
      expect(revoke.mock.calls).toEqual([["blob:first"], ["blob:second"]]);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

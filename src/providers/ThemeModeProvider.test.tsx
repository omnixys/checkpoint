import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { STORAGE_MODE } from "@/checkpoint/constants/color";
import ThemeModeProvider, { useThemeMode } from "./ThemeModeProvider";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeModeProvider initialThemeProfile={null}>{children}</ThemeModeProvider>
);

describe("ThemeModeProvider", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    const storage: Storage = {
      get length() {
        return values.size;
      },
      clear: () => values.clear(),
      getItem: (key) => values.get(key) ?? null,
      key: (index) => [...values.keys()][index] ?? null,
      removeItem: (key) => values.delete(key),
      setItem: (key, value) => values.set(key, value),
    };

    Object.defineProperty(window, "localStorage", { configurable: true, value: storage });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("uses dark mode when the user has not saved a preference", async () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });

    await waitFor(() => expect(result.current.mode).toBe("dark"));
  });

  it("keeps a user-selected mode", async () => {
    window.localStorage.setItem(STORAGE_MODE, "light");

    const { result } = renderHook(() => useThemeMode(), { wrapper });

    await waitFor(() => expect(result.current.mode).toBe("light"));
  });
});

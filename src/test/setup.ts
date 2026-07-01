import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

class ResizeObserverStub {
  observe() {
    // jsdom layout observer stub
  }
  unobserve() {
    // jsdom layout observer stub
  }
  disconnect() {
    // jsdom layout observer stub
  }
}

globalThis.ResizeObserver = ResizeObserverStub;

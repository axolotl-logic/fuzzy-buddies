import { vi } from "vitest";

export function makeMockInteractors() {
  return {
    click: vi.fn(),
    keyboardType: vi.fn(),
  };
}

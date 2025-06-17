// src/setupTests.ts
import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder;
}

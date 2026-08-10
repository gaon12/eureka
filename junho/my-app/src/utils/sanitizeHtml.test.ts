import { describe, expect, it } from "vitest";

import { sanitizeHtml } from "./sanitizeHtml";

describe("sanitizeHtml", () => {
  it("removes executable markup and unsafe URL schemes", () => {
    const result = sanitizeHtml(
      '<img src="javascript:alert(1)" onerror="alert(1)"><script>alert(1)</script>',
    );

    expect(result).toBe("<img>");
  });

  it("retains allowed markup with safe URLs", () => {
    expect(
      sanitizeHtml('<a href="https://example.com" target="_blank">notice</a>'),
    ).toBe('<a href="https://example.com" target="_blank">notice</a>');
  });
});

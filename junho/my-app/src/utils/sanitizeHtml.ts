const ALLOWED_TAGS = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "span",
  "strong",
  "u",
  "ul",
]);

const ALLOWED_ATTRS = new Set(["alt", "class", "href", "src", "target", "title"]);

const isSafeUrl = (value: string): boolean => {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value, window.location.origin);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
};

export const sanitizeHtml = (html: string | null | undefined): string => {
  if (typeof html !== "string") {
    return "";
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.body.querySelectorAll("*").forEach((node) => {
    const tagName = node.tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tagName)) {
      node.replaceWith(...node.childNodes);
      return;
    }

    [...node.attributes].forEach((attr) => {
      const attrName = attr.name.toLowerCase();
      const attrValue = attr.value;

      if (
        attrName.startsWith("on") ||
        !ALLOWED_ATTRS.has(attrName) ||
        ((attrName === "href" || attrName === "src") && !isSafeUrl(attrValue))
      ) {
        node.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
};

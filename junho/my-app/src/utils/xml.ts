export const getXmlText = (element: Element, tagName: string): string =>
  element.getElementsByTagName(tagName)[0]?.textContent ?? "";

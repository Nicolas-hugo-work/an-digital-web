export const QUOTE_EVENT = "an:quote-service";
export type ServiceKey = "loyalty" | "nfc" | "landing" | "webapps" | "maintenance" | "aiCalls";
export const serviceKeys: ServiceKey[] = ["loyalty", "nfc", "landing", "webapps", "maintenance", "aiCalls"];

export const requestQuote = (key: ServiceKey) =>
  window.dispatchEvent(new CustomEvent<ServiceKey>(QUOTE_EVENT, { detail: key }));

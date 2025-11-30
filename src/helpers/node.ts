import type { DOMWindow } from "jsdom";

export default async function initDOMAsync(): Promise<{ window: Window | DOMWindow; document: Document }> {
    const isModule = typeof window === "undefined" && typeof require !== "undefined";
    if (isModule) {
        if (typeof document === "undefined") {
            const url = "jsdom";
            const { JSDOM } = await import(/* @vite-ignore */ url) as typeof import("jsdom");
            const window = new JSDOM().window;
            const document = window.document;
            return { window, document };
        }
    }
    return { window, document };
}
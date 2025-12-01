import type { DOMWindow } from "jsdom";

export type IWindow = Window & typeof globalThis | DOMWindow;

export async function initDOMAsync(): Promise<IWindow> {
    const isModule = typeof window === "undefined";
    if (isModule) {
        if (typeof document === "undefined") {
            const url = "jsdom";
            const { JSDOM } = await import(/* @vite-ignore */ url) as typeof import("jsdom");
            return new JSDOM().window;
        }
    }
    return window;
}
import type {
    CardType,
    InfoType,
    IBiliBiliCard
} from "../../types";

import "../../helpers/polyfill";

import {
    getDefaultInfoTypes,
    defaultTitle,
    defaultAuthor,
    defaultDuration,
    defaultProxy,
    initCard,
    connectedCallback,
    attributeChangedCallback,
    getInfo
} from "../../helpers/builder";

import defaultTheme from "../../styles/bilibili-card.css?url";
import { dom } from "../../helpers/dom";

interface IStyleHost {
    setStyle(style: string): void;
}

class SheetStyleHost implements IStyleHost {
    style: CSSStyleSheet;
    constructor(shadowRoot: ShadowRoot) {
        const style = this.style = new CSSStyleSheet();
        shadowRoot.adoptedStyleSheets = [style];
    }
    setStyle(style: string) {
        return this.style.replace(style);
    }
}

class ElementStyleHost implements IStyleHost {
    style: HTMLStyleElement;
    constructor(shadowRoot: ShadowRoot) {
        const style = this.style = dom.document.createElement("style");
        shadowRoot.appendChild(style);
    }
    setStyle(style: string) {
        this.style.textContent = style;
    }
}

function createStyleHost(shadowRoot: ShadowRoot) {
    return "adoptedStyleSheets" in shadowRoot
        ? new SheetStyleHost(shadowRoot)
        : new ElementStyleHost(shadowRoot);
}

export default class BiliBiliCard extends dom.HTMLElement implements IBiliBiliCard {
    declare isLoaded: boolean;
    declare contents: {
        link: HTMLAnchorElement;
        cover: HTMLDivElement;
        duration: HTMLDivElement;
        title: HTMLParagraphElement;
        info: HTMLDivElement;
        type: HTMLLabelElement;
        author: HTMLSpanElement;
        theme: HTMLLinkElement;
        style: SheetStyleHost | ElementStyleHost;
    };

    static getTheme = (theme?: string | null) => {
        return theme || defaultTheme;
    }

    static get observedAttributes() {
        return ["vid", "type", "title", "author", "cover", "duration", "views", "danmakus", "comments", "favorites", "coins", "likes", "info-types", "image-proxy", "theme", "shadow-style"];
    }

    constructor() {
        super();

        this.isLoaded = false;
        const shadowRoot = this.attachShadow({ mode: "open" });

        const theme = dom.document.createElement("link");
        theme.rel = "stylesheet";
        shadowRoot.appendChild(theme);

        const style = createStyleHost(shadowRoot);

        initCard.call(this, shadowRoot);

        this.contents.theme = theme;
        this.contents.style = style;
    }

    get vid(): string | null {
        return this.getAttribute("vid");
    }
    set vid(value: string) {
        this.setAttribute("vid", value);
    }

    get type(): CardType {
        return this.getAttribute("type") as CardType || "video";
    }
    set type(value) {
        this.setAttribute("type", value);
    }

    get title() {
        return this.getAttribute("title") || defaultTitle;
    }
    set title(value) {
        this.setAttribute("title", value);
    }

    get author() {
        return this.getAttribute("author") || defaultAuthor;
    }
    set author(value) {
        this.setAttribute("author", value);
    }

    get cover(): string | undefined {
        const value = this.getAttribute("cover");
        if (typeof value === "string") {
            return value.trimStart();
        }
    }
    set cover(value: string) {
        this.setAttribute("cover", typeof value === "string" ? value.trimStart() : value);
    }

    get duration() {
        return this.getAttribute("duration") || defaultDuration;
    }
    set duration(value) {
        this.setAttribute("duration", value);
    }

    get views() {
        return this.getAttribute("views") || '0';
    }
    set views(value) {
        this.setAttribute("views", value);
    }

    get danmakus() {
        return this.getAttribute("danmakus") || '0';
    }
    set danmakus(value) {
        this.setAttribute("danmakus", value);
    }

    get comments() {
        return this.getAttribute("comments") || '0';
    }
    set comments(value) {
        this.setAttribute("comments", value);
    }

    get favorites() {
        return this.getAttribute("favorites") || '0';
    }
    set favorites(value) {
        this.setAttribute("favorites", value);
    }

    get coins() {
        return this.getAttribute("coins") || '0';
    }
    set coins(value) {
        this.setAttribute("coins", value);
    }

    get likes() {
        return this.getAttribute("likes") || '0';
    }
    set likes(value) {
        this.setAttribute("likes", value);
    }

    get infoTypes() {
        const value = this.getAttribute("info-types");
        if (value && typeof value === "string") {
            const types = value.split(/[,|\s+]/).filter(x => x != '');
            if (types.length) {
                return types as InfoType[];
            }
        }
        return getDefaultInfoTypes(this.type);
    }
    set infoTypes(value) {
        this.setAttribute("info-types", Array.isArray(value) ? value.join(' ') : value as any);
    }

    get imageProxy() {
        return (this.getAttribute("image-proxy") || defaultProxy).trimEnd();
    }
    set imageProxy(value) {
        this.setAttribute("image-proxy", typeof value === "string" ? value.trimEnd() : value);
    }

    get theme() {
        return BiliBiliCard.getTheme(this.getAttribute("theme"));
    }
    set theme(value) {
        this.setAttribute("theme", value);
    }

    get shadowStyle() {
        return this.getAttribute("shadow-style") || '';
    }
    set shadowStyle(value) {
        this.setAttribute("shadow-style", value);
    }

    connectedCallback() {
        this.contents.theme.href = this.theme;
        this.contents.style.setStyle(this.shadowStyle);
        connectedCallback.call(this);
        this.isLoaded = true;
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (this.isLoaded && oldValue !== newValue) {
            switch (name) {
                case "theme":
                    this.contents.theme.href = BiliBiliCard.getTheme(newValue);
                    break;
                case "shadow-style":
                    this.contents.style.setStyle(newValue || '');
                    break;
                default:
                    attributeChangedCallback.call(this, name, newValue);
                    break;
            }
        }
    }

    getInfo(name: InfoType) {
        return getInfo.call(this, name);
    }
}
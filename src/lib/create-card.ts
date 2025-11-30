import type { cardType, themeType } from "../types";
import * as bilibiliCardMessage from "../tools/bilibili-card-message";
import * as bilibiliCardBuilder from "../tools/bilibili-card-builder";

export default async function createCardAsync<T extends boolean>(imageProxy: string, id: string, type: cardType, infoTypes: string, theme: themeType, isComponent: T, log: { warn: (arg0: string) => void; } = console) {
    if (!id?.length) { return; }
    const message = await bilibiliCardMessage.getMessageAsync(type, id, log);
    if (isComponent) {
        return bilibiliCardBuilder.createHost(imageProxy, infoTypes, message, theme);
    }
    else {
        const card = bilibiliCardBuilder.createCard(imageProxy, infoTypes, message, theme);
        const inner = card.firstChild as HTMLElement | null;
        if (!inner) { return; }
        inner.classList.add("bilibili-card");
        return inner;
    }
}
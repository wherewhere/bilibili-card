import type { CardType } from "../../types";
import * as bilibiliCardMessage from "../../tools/bilibili-card-message";
import * as bilibiliCardBuilder from "../../tools/bilibili-card-builder";

export default async function createCardAsync<T extends boolean>(imageProxy: string, id: string, type: CardType, InfoTypes: string, theme: string, isComponent: T, log: { warn: (arg0: string) => void; } = console) {
    if (!id?.length) { return; }
    const message = await bilibiliCardMessage.getMessageAsync(type, id, log);
    if (isComponent) {
        return bilibiliCardBuilder.createHost(imageProxy, InfoTypes, message, theme);
    }
    else {
        const card = bilibiliCardBuilder.createCard(imageProxy, InfoTypes, message, theme);
        const inner = card.firstChild as HTMLElement | null;
        if (!inner) { return; }
        inner.classList.add("bilibili-card");
        return inner;
    }
}
import type BiliBiliCard from "../../components/bilibili-card";
import system from "../../styles/bilibili-card.css?url";
import light from "../../styles/bilibili-card.light.css?url";
import dark from "../../styles/bilibili-card.dark.css?url";
import fluent from "../../styles/bilibili-card.fluent.css?url";
import windose from "../../styles/bilibili-card.windose.css?url";

export function getTheme(theme?: string | null): string {
    if (!theme) { return system; }
    switch (theme.toLowerCase()) {
        case '1':
        case "light":
            return light;
        case '2':
        case "dark":
            return dark;
        case "fd":
        case "fd2":
        case "fluent":
        case "fluentui":
            return fluent;
        case "windose":
            return windose;
        case '0':
        case "auto":
        case "system":
        case "default":
        default:
            return system;
    }
}

export function registerGetTheme(card: typeof BiliBiliCard) {
    card.getTheme = getTheme;
}
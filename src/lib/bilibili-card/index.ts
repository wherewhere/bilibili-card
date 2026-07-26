import type { Plugin } from "vite";
import type { CardType } from "../../types";
import { compileSFCAsync } from "./compiler-sfc";
import createCardAsync from "../create-card";

export default function bilibiliCard(options = { image_proxy: "https://images.weserv.nl/?url=" }): Plugin {
    return {
        name: "vite:bilibili-card",
        enforce: "pre",
        resolveId(source) {
            if (source.startsWith("bilibili-card:")) {
                return source;
            }
        },
        async load(id) {
            if (id.startsWith("bilibili-card:")) {
                const url = new URL(id);
                const { pathname, searchParams } = url;
                const imageProxy = searchParams.get("proxy") || options.image_proxy;
                const type = searchParams.get("type") || undefined;
                const info = searchParams.get("info-types") || undefined;
                const card = await createCardAsync(imageProxy, pathname, type as CardType, info!, "system", false);
                if (!card) { return; }
                const code = [
                    "<template>",
                    "   <ShadowRoot :adoptedStyleSheets='adoptedStyleSheets'>",
                    '       <link v-if="theme" :href="theme" rel="stylesheet" />',
                    '       <component v-if="!isAdoptedStyleSheetsSupported && shadowStyle" is="style">{{ shadowStyle }}</component>',
                    card.outerHTML,
                    "   </ShadowRoot>",
                    "</template>",
                    "<script setup>",
                    "import { watch } from 'vue';",
                    "import { ShadowRoot } from 'vue-shadow-dom';",
                    "const { shadowStyle } = defineProps({ theme: String, shadowStyle: String });",
                    "let adoptedStyleSheets;",
                    "const isAdoptedStyleSheetsSupported = 'adoptedStyleSheets' in window.ShadowRoot.prototype;",
                    "if (isAdoptedStyleSheetsSupported) {",
                    "   const style = new CSSStyleSheet();",
                    "   adoptedStyleSheets = [style];",
                    "   if (shadowStyle) {",
                    "       style.replace(shadowStyle);",
                    "   }",
                    "   watch(",
                    "       () => shadowStyle,",
                    "       (newValue, oldValue) => {",
                    "           if (newValue !== oldValue) {",
                    "               style.replace(newValue || '');",
                    "           }",
                    "       }",
                    "   );",
                    "}",
                    "</script>"
                ].join('\n');
                return await compileSFCAsync(code, id);
            }
        }
    } as Plugin;
};
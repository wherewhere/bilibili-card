import type { Plugin } from "vite";
import { compileSFC } from "./compiler-sfc.mts";
import createCardAsync from "./create-card";

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
                const card = await createCardAsync(imageProxy, [pathname, type!, info!], false);
                const code = [
                    "<template>",
                    "<ShadowRoot>",
                    '<link v-if="theme" :href="theme" rel="stylesheet" />',
                    card,
                    "</ShadowRoot>",
                    "</template>",
                    '',
                    "<script setup>",
                    'import { ShadowRoot } from "vue-shadow-dom";',
                    "const { theme } = defineProps({ theme: String });",
                    "</script>"
                ].join('\n');
                return compileSFC(code, id);
            }
        }
    } as Plugin;
};
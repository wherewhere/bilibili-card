<template>
    <div>
        <ReadMe>
            <div style="display: flex; flex-direction: column; row-gap: 0.5rem;">
                <CodeMirror label="代码：" placeholder="<bilibili-card></bilibili-card>" v-model="example"
                    :language="htmlLanguage" style="font-family: var(--font-monospace);" />
                <InputLabel label="显示：">
                    <div v-html="example"></div>
                </InputLabel>
            </div>
        </ReadMe>
    </div>
</template>

<script lang="ts" setup>
import "../types";
import { shallowRef } from "vue";
import { html } from "@codemirror/lang-html";
import ReadMe from "../../README.md";
import CodeMirror from "../components/CodeMirror.vue";
import InputLabel from "../components/InputLabel.vue";

const htmlLanguage = html({
    extraTags: {
        "bilibili-card": {
            attrs: {
                vid: null,
                type: ["video", "article", "user", "live", "bangumi", "audio", "dynamic", "favorite", "album"],
                title: null,
                author: null,
                cover: null,
                duration: null,
                views: null,
                danmakus: null,
                comments: null,
                favorites: null,
                coins: null,
                likes: null,
                "info-types": ["views", "danmakus", "comments", "favorites", "coins", "likes"],
                "image-proxy": null,
                theme: ["system", "light", "dark", "fluent", "windose"],
                "shadow-style": null
            }
        }
    }
});
const example = shallowRef(
    `<bilibili-card vid="BV1y54y1a768" type="video" title="【UWP】手把手教你安装 UWP 安装包" author="where-where"
    cover="http://i2.hdslb.com/bfs/archive/41bc750cb5011bb036e008a716a89158c7eb7bb5.jpg" duration="05:21" views="2.2万"
    danmakus="4" comments="75" favorites="253" coins="106" likes="287" info-types="views danmakus"
    theme="fluent"></bilibili-card>`);
</script>

<style lang="scss" scoped>
@font-face {
    font-family: "DinkieBitmap 9px";
    src: local("DinkieBitmap 9px"), local("丁卯点阵体 9px"),
        url("https://cdn.jsdelivr.net/gh/haldai/org-slides@master/style/fonts/DinkieBitmap-9px.woff2") format("woff2");
}

:deep(img) {
    max-width: 100%;
}

:deep(pre) {
    margin-bottom: 0.5rem;
    border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-rest);
    border-radius: calc(var(--control-corner-radius) * 1px);
}

:deep(table) {
    border-collapse: separate;
}
</style>
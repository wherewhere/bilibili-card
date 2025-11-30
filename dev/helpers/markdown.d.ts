declare module "highlightjs-vue/dist/highlightjs-vue.esm.js" {
    import type { HLJSApi, LanguageFn } from "highlight.js";
    const exports: (hljs: HLJSApi) => void;
    export default exports;
    export const definer: LanguageFn;
}
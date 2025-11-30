// rollup.config.mjs
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import postcssPresetEnv from "postcss-preset-env";
import url from "./src/lib/import-url.mjs";

const resolveConfig = resolve({
    extensions: [".ts"]
});

const babelESConfig = babel({
    extensions: [".ts"],
    targets: "defaults",
    babelHelpers: "bundled"
});

const babelCJSConfig = babel({
    extensions: [".ts"],
    targets: "maintained node versions",
    babelHelpers: "bundled"
});

const babelESFallbackConfig = babel({
    extensions: [".ts"],
    targets: "supports es6-module",
    babelHelpers: "bundled"
});

const babelIIFEConfig = babel({
    extensions: [".ts"],
    targets: "defaults",
    babelHelpers: "bundled"
});

const babelIIFEFallbackConfig = babel({
    extensions: [".ts"],
    targets: "supports flexbox",
    babelHelpers: "bundled"
});

const dtsConfig = dts();

const postcssConfig = postcss({
    extract: true,
    sourceMap: true
});

const postcssFallbackConfig = postcss({
    extract: true,
    sourceMap: true,
    plugins: [postcssPresetEnv({
        stage: 1,
        browsers: ["IE >= 1", "Firefox >= 1", "Chrome >= 1", "Safari >= 1", "Opera >= 1"]
    })]
});

const urlConfig = url({
    limit: false,
    include: ["**/*.*"],
    fileName: "[dirname][name][extname]"
});

const esPlugin = [resolveConfig, babelESConfig, postcssConfig, urlConfig];
const esFallbackPlugin = [resolveConfig, babelESFallbackConfig, postcssFallbackConfig, urlConfig];
const iifePlugin = [resolveConfig, babelIIFEConfig, postcssConfig, urlConfig];
const iifeFallbackPlugin = [resolveConfig, babelIIFEFallbackConfig, postcssFallbackConfig, urlConfig];
const cjsPlugin = [resolveConfig, babelCJSConfig, urlConfig];
const dtsPlugin = [dtsConfig, postcssConfig];

/** @type {import("rollup").RollupOptions[]} */
export default [{
    external: ["@vue/compiler-sfc", "jsdom"],
    input: "src/index.ts",
    output: {
        format: "es",
        sourcemap: true,
        dir: "dist",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        manualChunks: {
            "helpers": ["src/helpers/builder", "src/helpers/polyfill", "src/helpers/url"],
            "components/bilibili-card": ["src/components/bilibili-card"],
            "components/bilibili-card.css": ["src/components/bilibili-card.css"],
            "components/bilibili-card.dark.css": ["src/components/bilibili-card.dark.css"],
            "components/bilibili-card.fluent.css": ["src/components/bilibili-card.fluent.css"],
            "components/bilibili-card.light.css": ["src/components/bilibili-card.light.css"],
            "components/bilibili-card.windose.css": ["src/components/bilibili-card.windose.css"],
            "lib/create-card": ["src/lib/create-card"],
            "lib/bilibili-card": ["src/lib/bilibili-card"],
            "tools/bilibili-card-builder": ["src/tools/bilibili-card-builder"],
            "tools/bilibili-card-message": ["src/tools/bilibili-card-message"]
        },
        minifyInternalExports: false
    },
    plugins: esPlugin
}, {
    input: "src/index.ts",
    output: {
        format: "es",
        dir: "dist",
        entryFileNames: "[name].d.ts",
        chunkFileNames: "[name].d.ts",
        manualChunks: {
            "components/bilibili-card": ["src/components/bilibili-card"],
        }
    },
    plugins: dtsPlugin
}];
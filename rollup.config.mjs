// rollup.config.mjs
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import postcssPresetEnv from "postcss-preset-env";
import url from "./src/lib/import-url.mjs";
import jscc from "rollup-plugin-jscc";

const resolveConfig = resolve({
    extensions: [".ts"]
});

const babelESConfig = babel({
    extensions: [".ts"],
    targets: "defaults",
    babelHelpers: "bundled"
});

const babelESFallbackConfig = babel({
    extensions: [".ts"],
    targets: "supports custom-elementsv1 and supports es6-module",
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
        browsers: ["supports custom-elementsv1 and supports es6-module"]
    })]
});

const urlConfig = url({
    limit: false,
    include: ["**/*.*"],
    fileName: "[dirname][name][extname]"
});

const esFallbackDefine = jscc({
    values: {
        _BROWSER: true
    }
});

const esPlugin = [resolveConfig, babelESConfig, postcssConfig, urlConfig];
const esFallbackPlugin = [resolveConfig, babelESFallbackConfig, postcssFallbackConfig, urlConfig, esFallbackDefine];
const dtsPlugin = [dtsConfig, postcssConfig];

/** @type {import("rollup").RollupOptions[]} */
export default [{
    external: ["@vue/compiler-sfc", "jsdom"],
    input: ["src/index.ts", "src/components/index.ts"],
    output: {
        format: "es",
        sourcemap: true,
        dir: "dist",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        preserveModules: true,
        preserveModulesRoot: "src"
    },
    plugins: esPlugin
}, {
    external: ["@vue/compiler-sfc", "jsdom"],
    input: "src/index.ts",
    output: {
        format: "es",
        sourcemap: true,
        dir: "dist",
        entryFileNames: "[name].browser.js"
    },
    plugins: esFallbackPlugin
}, {
    external: ["@vue/compiler-sfc", "jsdom"],
    input: "src/components/bilibili-card/bundle.ts",
    output: {
        format: "umd",
        name: "BiliBiliCard",
        sourcemap: true,
        dir: "dist/components/bilibili-card",
        entryFileNames: "index.browser.js"
    },
    plugins: esFallbackPlugin
}, {
    external: ["@vue/compiler-sfc", "jsdom", "vite"],
    input: "src/index.ts",
    output: {
        format: "es",
        dir: "dist",
        entryFileNames: "[name].d.ts",
        chunkFileNames: "[name].d.ts",
        preserveModules: true,
        preserveModulesRoot: "src"
    },
    plugins: dtsPlugin
}];
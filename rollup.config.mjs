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
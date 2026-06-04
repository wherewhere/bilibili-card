import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import simpleHtmlPlugin from "vite-plugin-simple-html";
import jscc from "rollup-plugin-jscc";
import markdown from "./helpers/markdown";
import _eval from "./helpers/eval";
import githubImporter from "./helpers/github-importer";
import bilibiliCard from "../src/lib/bilibili-card";
import cssnano from "cssnano";

export default defineConfig({
    root: "dev",
    base: "./",
    plugins: [
        vue({
            include: [/\.vue$/, /\.md$/],
            template: {
                compilerOptions: {
                    isCustomElement: tag => tag.includes('-')
                }
            }
        }),
        svgLoader(),
        simpleHtmlPlugin({
            minify: {
                minifyJs: true,
                sortSpaceSeparatedAttributeValues: true,
                sortAttributes: true,
                tagOmission: false
            }
        }),
        jscc({
            values: {
                _BROWSER: true
            }
        }),
        bilibiliCard(),
        markdown,
        _eval
    ],
    css: {
        preprocessorOptions: {
            scss: {
                importers: [githubImporter]
            }
        },
        postcss: {
            plugins: [
                cssnano({
                    preset: [
                        "advanced",
                        { discardUnused: { fontFace: false } }
                    ],
                })
            ]
        },
        devSourcemap: true
    },
    build: {
        outDir: "dist",
        sourcemap: true,
        rolldownOptions: {
            checks: {
                pluginTimings: false
            }
        }
    }
});
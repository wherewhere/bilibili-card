<template>
    <InputLabel :label="label">
        <template #action>
            <slot></slot>
        </template>
        <div class="code-mirror" ref="root" :style="{ resize: resize, height: height }"></div>
    </InputLabel>
</template>

<script lang="ts" setup>
import "../styles/fonts.scss";
import { onMounted, onUnmounted, useTemplateRef, watch } from "vue";
import { basicSetup } from "codemirror";
import { Compartment, type Extension } from "@codemirror/state";
import { indentUnit } from "@codemirror/language";
import { keymap, placeholder, EditorView } from "@codemirror/view";
import { vscodeDark, vscodeLight } from "../helpers/theme";
import { vscodeKeymap } from "@replit/codemirror-vscode-keymap";
import { isDarkTheme } from "color-scheme-checker/src/theme";
import { registerColorSchemeListener, unregisterColorSchemeListener } from "color-scheme-checker/src/monitor";
import type { Property } from "csstype";
import InputLabel from "./InputLabel.vue";

const { indentUnit: _indentUnit = "    ", placeholder: _placeholder = '', language } = defineProps<{
    label?: string,
    resize?: "none" | "vertical" | "horizontal" | "both",
    height?: Property.Height<(string & {}) | 0>,
    indentUnit?: string,
    placeholder?: string,
    language: Extension
}>();

let changed = false;
const value = defineModel<string>();
watch(
    value,
    (newValue, oldValue) => {
        if (!changed && newValue !== oldValue) {
            editor!.dispatch({ changes: { from: 0, to: editor!.state.doc.length, insert: newValue } });
        }
        changed = false;
    }
);

const indentUnitSet = new Compartment();
watch(
    () => _indentUnit,
    (newValue) => {
        editor!.dispatch({ effects: indentUnitSet.reconfigure(indentUnit.of(newValue)) });
    }
);

const placeholderSet = new Compartment();
watch(
    () => _placeholder,
    (newValue) => {
        editor!.dispatch({ effects: placeholderSet.reconfigure(placeholder(newValue)) });
    }
);

const languageSet = new Compartment();
watch(
    () => language,
    (newValue) => {
        editor!.dispatch({ effects: languageSet.reconfigure(newValue) });
    }
);

let editor: EditorView | null = null;
const themeSet = new Compartment();
function updateTheme(isDark: boolean) {
    editor!.dispatch({ effects: themeSet.reconfigure(isDark ? vscodeDark : vscodeLight) });
}

const root = useTemplateRef("root");
onMounted(() => {
    editor = new EditorView({
        doc: value.value,
        parent: root.value!,
        extensions: [
            basicSetup,
            indentUnitSet.of(indentUnit.of(_indentUnit)),
            themeSet.of(isDarkTheme() ? vscodeDark : vscodeLight),
            placeholderSet.of(placeholder(_placeholder)),
            languageSet.of(language),
            keymap.of(vscodeKeymap),
            EditorView.updateListener.of(e => {
                if (e.docChanged) {
                    changed = true;
                    value.value = e.state.doc.toString();
                }
            })
        ]
    });
    registerColorSchemeListener(updateTheme);
});
onUnmounted(() => {
    unregisterColorSchemeListener(updateTheme);
    editor?.destroy();
});
</script>

<style lang="scss" scoped>
.code-mirror {
    display: flex;
    flex-direction: column;
    background: padding-box linear-gradient(var(--neutral-fill-input-rest), var(--neutral-fill-input-rest)), border-box var(--neutral-stroke-input-rest);
    border: calc(var(--stroke-width) * 1px) solid transparent;
    border-radius: calc(var(--control-corner-radius) * 1px);
    color: var(--neutral-foreground-rest);
    fill: currentcolor;
    position: relative;
    outline: none;
    overflow: auto;
    transition: border-color 0.083s ease-in-out, background-color 0.083s ease-in-out;
    padding-bottom: calc(var(--stroke-width) * 1px);
    scrollbar-width: thin;

    @media (forced-colors: none) {

        &:not(:disabled):active,
        &:not(:disabled):focus-within {
            border-bottom: calc(var(--stroke-width) * 2px) solid var(--accent-fill-rest);
            padding-bottom: 0;
        }
    }

    :deep(.cm-editor) {
        background: none;
        outline: none;
        min-width: fit-content;
        flex: 1;

        .cm-diagnostic,
        .cm-completionInfo,
        .cm-tooltip-autocomplete>ul {
            font-family: var(--font-monospace);
        }

        .cm-tooltip-autocomplete {
            opacity: 1;
            box-shadow: var(--elevation-shadow-flyout);
            background: var(--fill-color);
            border-radius: calc(var(--layer-corner-radius) * 1px);
            box-sizing: border-box;
            padding: calc((var(--design-unit) - var(--stroke-width)) * 1px);
            border: calc(var(--stroke-width) * 1px) solid transparent;
            transition: opacity 0.083s ease-in-out, background-color 0.083s ease-in-out;

            @starting-style {
                opacity: 0;
            }

            >ul {
                scrollbar-width: thin;

                >li {
                    background: var(--neutral-fill-stealth-rest);
                    border-radius: calc(var(--control-corner-radius) * 1px);
                    border: calc(var(--stroke-width) * 1px) solid transparent;
                    box-sizing: border-box;
                    color: var(--neutral-foreground-rest);
                    padding: calc(var(--stroke-width) * 2px) calc(var(--stroke-width) * 4px);
                    transition: background-color 0.083s ease-in-out;

                    &:not(:disabled):hover {
                        background: var(--neutral-fill-stealth-hover);
                    }

                    &:not(:disabled):active {
                        background: var(--neutral-fill-stealth-active);
                    }

                    &[aria-selected]:not(:disabled) {
                        background: var(--neutral-fill-secondary-rest);
                    }

                    &[aria-selected]:not(:disabled):hover {
                        background: var(--neutral-fill-secondary-hover);
                    }

                    &[aria-selected]:not(:disabled):active {
                        background: var(--neutral-fill-secondary-active);
                    }
                }
            }
        }

        .cm-gutters {
            border-right-width: calc(var(--stroke-width) * 1px);
            border-right-style: solid;
            border-radius: calc((var(--control-corner-radius) - 1) * 1px) 0 0 calc((var(--control-corner-radius) - 1) * 1px);
            transition: background-color 0.083s ease-in-out;
        }

        .cm-panels {
            background: var(--neutral-fill-stealth-rest);
        }

        .cm-button {
            border: calc(var(--stroke-width) * 1px) solid transparent;
            background: padding-box linear-gradient(var(--neutral-fill-rest), var(--neutral-fill-rest)), border-box var(--neutral-stroke-control-rest);
            font-family: var(--body-font);
            color: var(--neutral-foreground-rest);
            border-radius: calc(var(--control-corner-radius) * 1px);
            fill: currentcolor;

            &:not(:disabled):active {
                background: padding-box linear-gradient(var(--neutral-fill-active), var(--neutral-fill-active)), border-box var(--neutral-stroke-control-active);
            }

            &:not(:disabled):hover {
                background: padding-box linear-gradient(var(--neutral-fill-hover), var(--neutral-fill-hover)), border-box var(--neutral-stroke-control-hover);
            }

            &:disabled {
                background: padding-box linear-gradient(var(--neutral-fill-rest), var(--neutral-fill-rest)), border-box var(--neutral-stroke-rest);
                opacity: var(--disabled-opacity);
                cursor: not-allowed;
            }
        }

        .cm-textfield {
            background: padding-box linear-gradient(var(--neutral-fill-input-rest), var(--neutral-fill-input-rest)), border-box var(--neutral-stroke-input-rest);
            border: calc(var(--stroke-width) * 1px) solid transparent;
            border-radius: calc(var(--control-corner-radius) * 1px);
            font-family: var(--body-font);
            color: var(--neutral-foreground-rest);
            fill: currentcolor;
            position: relative;
            outline: none;

            @media (forced-colors: none) {

                &:not(:disabled):active,
                &:not(:disabled):focus-within {
                    padding-bottom: calc(0.2em - 1px);
                    border-bottom: calc(var(--stroke-width) * 2px) solid var(--accent-fill-rest);
                }
            }
        }

        .cm-panel.cm-search label {
            display: inline-flex;
            vertical-align: middle;
            align-items: center;
        }

        .cm-searchMatch {
            background-color: rgba(234, 92, 0, 0.33);
        }

        .cm-searchMatch-selected {
            background-color: rgba(234, 92, 0, 0.22);
        }

        @media (prefers-color-scheme: dark) {
            .cm-searchMatch-selected {
                background-color: #9E6A03;
            }
        }
    }
}
</style>
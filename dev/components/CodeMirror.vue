<template>
    <InputLabel :label="label">
        <template #action>
            <slot></slot>
        </template>
        <div class="code-mirror" ref="root" :style="{ resize: resize, height: height }"></div>
    </InputLabel>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, useTemplateRef, watch } from "vue";
import { basicSetup } from "codemirror";
import { Compartment, type Extension } from "@codemirror/state";
import { indentUnit } from "@codemirror/language";
import { keymap, placeholder, EditorView } from "@codemirror/view";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
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
    background: padding-box linear-gradient(var(--neutral-fill-input-rest), var(--neutral-fill-input-rest)), border-box var(--neutral-stroke-input-rest);
    border: calc(var(--stroke-width) * 1px) solid transparent;
    border-radius: calc(var(--control-corner-radius) * 1px);
    color: var(--neutral-foreground-rest);
    fill: currentcolor;
    position: relative;
    outline: none;
    overflow: auto;
    transition: border-color 0.083s ease-in-out, background-color 0.083s ease-in-out;

    @media (forced-colors: none) {

        &:not(:disabled):active,
        &:not(:disabled):focus-within {
            border-bottom: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
        }
    }

    :deep(.cm-editor) {
        background: none;
        outline: none;
        width: fit-content;
        min-width: 100%;
        height: 100%;

        .cm-scroller,
        .cm-diagnostic,
        .cm-completionInfo,
        .cm-tooltip-autocomplete>ul {
            font-family: var(--font-monospace);
        }

        .cm-tooltip-section {
            padding: 3px 8px;
            white-space: pre-wrap;
            font-family: var(--font-monospace);
        }

        .cm-gutters {
            border-radius: calc((var(--control-corner-radius) - 1) * 1px) 0 0 calc((var(--control-corner-radius) - 1) * 1px);
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
                    border-bottom: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
                }
            }
        }

        .cm-panel.cm-search label {
            display: inline-flex;
            vertical-align: middle;
            align-items: center;
        }
    }
}
</style>
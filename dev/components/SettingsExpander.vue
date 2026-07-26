<template>
    <details class="settings-expander" :open="expanded">
        <summary class="expander">
            <div class="content-presenter">
                <ProvideValue name="fillColor" :value="neutralFillInputRest">
                    <SettingsPresenter class="presenter">
                        <template #icon>
                            <slot name="icon"></slot>
                        </template>
                        <template #header>
                            <slot name="header"></slot>
                        </template>
                        <template #description>
                            <slot name="description"></slot>
                        </template>
                        <slot name="action-content"></slot>
                    </SettingsPresenter>
                </ProvideValue>
            </div>
            <div class="expand-collapse-chevron-border">
                <ChevronDown12Regular class="expand-collapse-chevron-down" />
                <ChevronUp12Regular class="expand-collapse-chevron-up" />
            </div>
        </summary>
        <div class="expander-content">
            <div v-fill-color="neutralFillLayerAltRest">
                <ProvideValue name="fillColor" :value="undefined">
                    <slot></slot>
                </ProvideValue>
            </div>
        </div>
    </details>
</template>

<script lang="ts" setup>
import { neutralFillInputRest, neutralFillLayerAltRest } from "@fluentui/web-components";
import ProvideValue from "./ProvideValue.vue";
import SettingsPresenter from "./SettingsPresenter.vue";
import ChevronDown12Regular from "@fluentui/svg-icons/icons/chevron_down_12_regular.svg?component";
import ChevronUp12Regular from "@fluentui/svg-icons/icons/chevron_up_12_regular.svg?component";
import vFillColor from "../directives/fillColor";

defineProps<{
    expanded?: "true" | "false";
}>();
</script>

<style lang="scss" scoped>
@use "../styles/expander";

$settings-expander-header-padding: calc(var(--design-unit) * 1px) 0 calc(var(--design-unit) * 1px) calc(var(--design-unit) * 2px);
$settings-expander-item-padding: 0 calc((var(--base-height-multiplier) + 1 + var(--density)) * var(--design-unit) * 1px) 0 calc((var(--base-horizontal-spacing-multiplier) * 12 - var(--design-unit) * 1.5) * 1px + var(--type-ramp-base-line-height));

.settings-expander {
    .expander {
        box-sizing: border-box;
        box-shadow: var(--elevation-shadow-card-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);

        &:hover {
            background: var(--neutral-fill-input-hover);
            border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-layer-hover);
            box-shadow: var(--elevation-shadow-card-hover);
        }

        &:active {
            background: var(--neutral-fill-input-active);
            border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-layer-active);
            box-shadow: var(--elevation-shadow-card-active);
        }

        .expander-content {
            border-bottom-left-radius: calc((var(--control-corner-radius) - var(--stroke-width)) * 1px);
            border-bottom-right-radius: calc((var(--control-corner-radius) - var(--stroke-width)) * 1px);
        }
    }

    &[open] summary {
        border-radius: calc(var(--control-corner-radius) * 1px) calc(var(--control-corner-radius) * 1px) 0 0;
    }

    .presenter {
        padding: $settings-expander-header-padding;
    }

    :deep(div.setting-expander-content-grid) {
        padding: $settings-expander-item-padding;
    }
}
</style>
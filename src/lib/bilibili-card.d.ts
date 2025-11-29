declare module "bilibili-card:*" {
    import type { defineComponent, HTMLAttributes } from "vue";
    interface BilibiliCardProps extends HTMLAttributes {
        theme?: string;
    }
    const component: ReturnType<typeof defineComponent<BilibiliCardProps>>;
    export default component;
}
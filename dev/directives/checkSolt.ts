import type { FunctionDirective, Slot } from "vue";

export function isSlot(solt?: Slot) {
    if (typeof solt === "undefined") {
        return false;
    }
    else if (typeof solt === "function") {
        const value = solt();
        if (value instanceof Array) {
            const result = value.some(x => {
                if (typeof x === "object") {
                    if (typeof x.type === "symbol") {
                        const children = x.children;
                        return children === "v-if" ? false
                            : typeof children === "string" || children instanceof Array ? !!children.length
                                : !!children;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return false;
                }
            });
            return result;
        }
    }
    return false;
}

const directive: FunctionDirective<HTMLElement, Slot | undefined> = (element, binding) => {
    if (element instanceof HTMLElement) {
        const solt = binding.value;
        if (isSlot(solt)) {
            if (element.style.display === "none") {
                element.style.display = '';
            }
        }
        else {
            element.style.display = "none";
        }
    }
};

export default directive;
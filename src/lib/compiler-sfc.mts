import { parse, compileScript } from "vue/compiler-sfc";
import type { SourceDescription } from "rollup";

export function compileSFC(source: string, filename: string): SourceDescription {
    const { descriptor } = parse(source, { filename });
    const script = compileScript(descriptor, {
        id: JSON.stringify(filename),
        inlineTemplate: true,
        genDefaultAs: "__sfc__"
    });
    const code = [
        script.content,
        "export default __sfc__;"
    ].join('\n');
    return { code, map: script.map as any };
}
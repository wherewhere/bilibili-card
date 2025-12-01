import type { SourceDescription } from "rollup";

export async function compileSFCAsync(source: string, filename: string): Promise<SourceDescription> {
    const { parse, compileScript } = await import("@vue/compiler-sfc");
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
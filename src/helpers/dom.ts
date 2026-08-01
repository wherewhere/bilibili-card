import { initDOMAsync } from "./node.ts";

/*#if _BROWSER
const dom = window;
//#else */
const dom = await initDOMAsync();
//#endif

export { dom };
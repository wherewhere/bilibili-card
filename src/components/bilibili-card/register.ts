import BiliBiliCard from ".";
import { dom } from "../../helpers/dom";
if (!dom.customElements.get("bilibili-card")) {
    dom.customElements.define("bilibili-card", BiliBiliCard);
}
export default BiliBiliCard;
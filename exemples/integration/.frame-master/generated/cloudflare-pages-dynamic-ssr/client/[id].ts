import Page from "../../../../src/pages/[id].tsx";
import hydrationClientAdapter from "../runtime/default-client-adapter.ts";

const payloadNode = document.getElementById("__FM_DYNAMIC_PAYLOAD__");
const mountElement = document.querySelector("#app");

if (payloadNode && mountElement) {
  const payload = JSON.parse(payloadNode.textContent || "{}");
  hydrationClientAdapter({
    Component: Page,
    payload,
    mountElement,
  });
}

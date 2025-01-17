import { STAGING_UI_URL, PRODUCTION_UI_URL } from "../constants"
import { Environment } from "."
import { generateDataHTMLStringByParams } from "./embed.params"

const getUrlByEnv = (environment: Environment) => {
  switch (environment) {
    case "staging":
      return STAGING_UI_URL
    case "production":
    default:
      return PRODUCTION_UI_URL
  }
}

const getWidgetV3EmbedCode = (data: Record<string, string | boolean | number>) => {
  const dataParams = generateDataHTMLStringByParams(data)

  return `<div id="ugc-widget"${dataParams}></div>`
}

const invokeV3Javascript = (environment: Environment, root: HTMLElement | ShadowRoot) => {
  const invocationScript = document.createElement("script")
  invocationScript.type = "module"
  invocationScript.textContent = `
    (async () => {
      const widget = await import('${getUrlByEnv(environment)}/core.esm.js');
      widget.init();
    })();
  `
  root.appendChild(invocationScript)
}

export { getWidgetV3EmbedCode, invokeV3Javascript }
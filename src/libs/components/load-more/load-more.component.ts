import { LoadMoreTemplate as template } from "./load-more.template"
import loadMoreStyles from "./load-more.scss"

export default class LoadMoreComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this.shadowRoot?.appendChild(template())
    const cssStyleSheet = new CSSStyleSheet()
    cssStyleSheet.replaceSync(loadMoreStyles)
    this.shadowRoot?.adoptedStyleSheets.push(cssStyleSheet)
  }

  disconnectedCallback() {
    this.shadowRoot?.replaceChildren()
  }
}

try {
  customElements.define("load-more", LoadMoreComponent)
  // eslint-disable-next-line
} catch (err) {
  // Allow load-more to be redefined without an error
}

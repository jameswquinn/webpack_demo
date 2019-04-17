
import './index.css';
import * as _ from "lodash-es";
alert(_.trim("hello      ") + "James");
alert('Hello');

//import for codepen.io

import { html, render } from 'lit-html';


class MyApp extends HTMLElement {
    static get observedAttributes() {
    return ["text"];
    }
  constructor() {
    super();
  }
  connectedCallback() {
        this.attachShadow({ mode: "open" });
        //this.shadowRoot.innerHTML =`<h1>Hello ${name}</h1>`;
        const template = html`
          <style>
            h1 {
              font-family: monospace;
              font-size: 4rem;
            }
          </style>
          <h1>${this.text}</h1>
        `;
        render(template, this.shadowRoot);

  }
    attributeChangedCallback(attr, oldValue, newValue) {
    this[attr] = newValue;
  }
}
window.customElements.define("my-app",MyApp);
/* eslint-disable */

class FakeHtmlElement {
  addEventListener() {}

  appendChild() {
    return new FakeHtmlElement();
  }
  
  createElement() {
    return new FakeHtmlElement();
  }
  
  createTextNode() {
    return new FakeHtmlElement();
  }

  createTreeWalker() {
    return new FakeHtmlElement();
  }

  define() {}

  querySelector() {
    return new FakeHtmlElement();
  }

  removeAttribute() {}

  setAttribute() {}

  pathname = "abs";

  public get head() {
    return this;
  }
}

if (typeof self["importScripts"] === "function") {
  self["CSSStyleSheet"] = FakeHtmlElement as any;
  self["Element"] = FakeHtmlElement as any;
  self["HTMLElement"] = FakeHtmlElement as any;
  self["customElements"] = new FakeHtmlElement() as any;
  self["require"] = (() => {}) as any;
  self["urlParsingNode"] = new FakeHtmlElement() as any;
  (self as any)["document"] = new FakeHtmlElement();
}

/* eslint-enable */

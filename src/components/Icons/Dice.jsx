import React, { Component } from "react";
import "./index.css";

export default class Dice extends Component {
  render() {
    return (
      <svg viewBox="0 0 29 32" width="100%" height="100%">
        <path d="M27.68 6.882l-10.728-6.232c-0.701-0.407-1.542-0.648-2.439-0.648s-1.739 0.24-2.463 0.66l0.024-0.013-10.735 6.232c-0.799 0.467-1.329 1.318-1.338 2.293v13.321c0 0 0 0 0 0.001 0 1.199 0.648 2.247 1.613 2.813l0.015 0.008 10.445 6.033c0.698 0.411 1.539 0.654 2.435 0.654s1.737-0.243 2.458-0.666l-0.023 0.012 10.445-6.025c0.998-0.566 1.662-1.62 1.667-2.828v-13.321c-0.017-0.983-0.562-1.835-1.363-2.287l-0.013-0.007zM6.882 22.373c-0.765 0.092-1.59-1.009-1.759-2.462s0.344-2.699 1.147-2.791 1.59 1.009 1.751 2.454-0.329 2.707-1.139 2.799zM14.627 10.705c-1.529 0-2.76-0.65-2.76-1.453s1.231-1.453 2.76-1.453 2.76 0.65 2.76 1.453-1.239 1.453-2.76 1.453zM14.627 5.414c-1.529 0-2.76-0.658-2.76-1.46s1.231-1.453 2.76-1.453 2.76 0.65 2.76 1.453-1.239 1.399-2.76 1.399zM21.303 25.539c-0.291 1.361-1.139 2.34-1.896 2.179s-1.124-1.407-0.833-2.768 1.147-2.347 1.904-2.179 1.124 1.399 0.826 2.768zM21.303 18.137c-0.291 1.369-1.139 2.34-1.896 2.179s-1.124-1.399-0.833-2.73 1.147-2.34 1.904-2.179 1.124 1.361 0.826 2.73zM26.655 22.534c-0.298 1.361-1.147 2.34-1.896 2.179s-1.132-1.407-0.833-2.776 1.147-2.34 1.896-2.179 1.101 1.407 0.803 2.776zM26.655 15.132c-0.298 1.369-1.147 2.34-1.896 2.179s-1.162-1.407-0.864-2.783 1.147-2.347 1.896-2.179 1.132 1.415 0.833 2.783z" />
      </svg>
    );
  }
}

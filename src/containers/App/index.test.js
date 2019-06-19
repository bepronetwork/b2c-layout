import React from "react";
import { render, cleanup } from "react-testing-library";

import App from "./index";

const { afterEach, it } = global;

afterEach(cleanup);

it("renders without crashing", () => {
  render(<App />);
});

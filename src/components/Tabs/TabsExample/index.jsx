import React, { Component } from "react";
import Tabs from "..";

const options = [
  {
    value: "register",
    label: "Register"
  },
  { value: "login", label: "Login" }
];

export default class TabsExample extends Component {
  state = {
    selected: "login"
  };

  handleChange = name => {
    this.setState({ selected: name });
  };

  render() {
    const { selected } = this.state;

    return (
      <Tabs
        selected={selected}
        options={options}
        onSelect={this.handleChange}
      />
    );
  }
}

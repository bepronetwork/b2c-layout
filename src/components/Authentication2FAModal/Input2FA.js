import ReactCodeInput from "react-code-input";
import React from "react";

class Input2FA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = (e) => {
    if (e.length === 6) {
      this.props.confirm({ token: e });
    }
  };

  render = () => {
    return (
      <ReactCodeInput
        autoFocus={true}
        type="number"
        fields={6}
        onChange={(e) => this.onChange(e)}
      />
    );
  };
}

export default Input2FA;

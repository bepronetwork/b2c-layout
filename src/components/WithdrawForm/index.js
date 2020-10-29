import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "lodash/fp";
import { HorizontalStepper } from "components";
import Confirmation from "./Confirmation";
import Form from "./Form";
import { CopyText } from "../../copy";
import _ from "lodash";
import "./index.css";

const defaultProps = {
  isConfirmed: false
};

class WithdrawForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...defaultProps };
  }

  componentDidMount() {}

  componentWillReceiveProps(props) {
    if (props !== this.props) {
    }
  }

  onHandlerConfirm = async isConfirmed => {
    this.setState({ isConfirmed });
  };

  render() {
    const { isConfirmed } = this.state;
    const { ln, isAffiliate, wallet, onAddress } = this.props;
    const copy = CopyText.amountFormIndex[ln];

    return (
      <HorizontalStepper
        showStepper={false}
        steps={[
          /*
                        {
                            label : "Confirmation",
                            nextButtonLabel : "Continue",
                            condition : isConfirmed,
                            content : <Confirmation  onConfirmed={this.onHandlerConfirm} />,
                            showBackButton : false
                        },*/
          {
            label: "Withdraw",
            content: (
              <Form
                isAffiliate={isAffiliate}
                wallet={wallet}
                onAddress={onAddress}
              />
            ),
            last: true,
            showCloseButton: false,
            showBackButton: false
          }
        ]}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default compose(connect(mapStateToProps))(WithdrawForm);

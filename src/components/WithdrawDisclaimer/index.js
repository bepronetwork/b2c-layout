
    import React, { Component } from "react";
    import { connect } from "react-redux";
    import { Checkbox, Typography } from "../../components";
    import { CopyText } from '../../copy';
    import classNames from "classnames";
    import "./index.css";

    
    class WithdrawDisclaimer extends Component {
    
        constructor(props){
            super(props);
            this.state = {
                isWithdraDisclaimerCheck : false
            }
        }

        onHandlerConfirm() {
            const { isWithdraDisclaimerCheck } = this.state;
            this.setState({ isWithdraDisclaimerCheck : !isWithdraDisclaimerCheck });
        }
    
        render() {
            const { ln, onClose } = this.props;
            const { isWithdraDisclaimerCheck } = this.state;
            const copy = CopyText.amountFormIndex[ln];

            const buttonStyles = classNames("button", {
                disabled : !isWithdraDisclaimerCheck
              });
  
            return (
                <div styleName="main">
                    <div>
                        <Typography variant='small-body' color={"red"}>
                            {copy.INDEX.DISCLAIMER.CONFIRM_DESC}
                        </Typography>
                    </div>
                    <div styleName="confirm">
                        <div styleName="check">
                            <Checkbox onClick={() => this.onHandlerConfirm()} isSet={isWithdraDisclaimerCheck} id={'isWithdraDisclaimerRead'}/>
                        </div>
                        <div styleName="check-text">
                            <Typography variant='small-body' color={"grey"}>
                                {copy.INDEX.DISCLAIMER.CONFIRM}
                            </Typography>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => onClose()} styleName={buttonStyles} disabled={!isWithdraDisclaimerCheck}>
                            <Typography color="fixedwhite">
                                Continue
                            </Typography>
                        </button>
                    </div>
                </div>
            );
        }
    }
    
    function mapStateToProps(state){
        return {
            ln : state.language
        };
    }
    
    export default connect(mapStateToProps)(WithdrawDisclaimer);
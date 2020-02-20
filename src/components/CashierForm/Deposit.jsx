import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { CurrencyDepositForm, HorizontalStepper, DepositForm } from 'components';
import { CopyText } from '../../copy';
class Deposit extends Component {

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    async projectData(props){       
        this.setState({...this.state})
    }

    closeDeposit = () => {
        const { onClose } = this.props;
        onClose();
    }

    render() {
        const { deposit } = this.props;
        const { currency, nextStep } = deposit;
        const {ln} = this.props;
const copy = CopyText.cashierFormDeposit[ln];

        return (
            <div styleName='root'>
                <div styleName="deposit">
                    <div styleName="title">
                        {/*<InformationBox type={'info'} message={'If you left open deposits please finish the process at the "Profile" Tab under "Cashier" or continue here'} image={info}/> */}
                        <HorizontalStepper 
                            showStepper={false}
                            nextStep={nextStep}
                            alertMessage={ copy.DEPOSIT.HORIZONTAL_STEPPER.ALERT_MESSAGE[0]}
                            steps={[
                                {
                                    label : copy.DEPOSIT.HORIZONTAL_STEPPER.LABEL[0],
                                    title : copy.DEPOSIT.HORIZONTAL_STEPPER.TITLE[0],
                                    condition : (currency != ''),
                                    content : <CurrencyDepositForm/>
                                },
                                {
                                    label : copy.DEPOSIT.HORIZONTAL_STEPPER.LABEL[1],
                                    title : copy.DEPOSIT.HORIZONTAL_STEPPER.TITLE[1] + currency.ticker,
                                    condition : (currency != ''),
                                    content : <DepositForm/>,
                                    last : true,
                                    showCloseButton : false,
                                    closeStepper : this.closeDeposit
                                }
                            ]}
                        />
                    </div>
               </div>   
            </div>
        );
    }
}



function mapStateToProps(state){
    return {
        deposit : state.deposit,
        profile : state.profile,
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(Deposit);

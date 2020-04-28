import React from "react";
import './index.css';
import { Row, Col } from 'reactstrap';
import { Typography, Checkbox } from 'components';
import { connect } from "react-redux";
import classNames from 'classnames';
import { getApp } from "../../lib/helpers";
import { formatCurrency } from '../../utils/numberFormatation';

class PaymentBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked : false,
            price : null,
            virtualTicker: null,
        }
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { wallet } = props;
        const virtual = getApp().virtual;

        if (virtual === true) {
            const virtualCurrency = getApp().currencies.find(c => c.virtual === true);

            if(wallet && virtualCurrency) {
                const virtualWallet = getApp().wallet.find(w => w.currency._id === virtualCurrency._id);
                const price = virtualWallet ? virtualWallet.price.find(p => p.currency === wallet.currency._id).amount : null;
                this.setState({ price, virtualTicker : virtualCurrency.ticker });
            }
        }

    }

    onClick = () => {
        const { id, onClick, isPicked } = this.props;
        if(onClick){
            onClick(id)
        }
    }

    render(){
        let { isPicked, wallet} = this.props;
        const { price, virtualTicker } = this.state;
        const styles = classNames("container-root", {
            selected: isPicked
        });

        return (
            <button onClick={this.onClick} styleName={styles}>
                <Row>
                    <Col xs={3} md={3}>
                        <div styleName='container-image'>
                            <img src={wallet.image ? wallet.image : wallet.currency.image} styleName='payment-image'/>
                        </div>
                    </Col>
                    <Col xs={5} md={7}>
                        <div styleName={'container-text'}>
                            <Typography variant={'small-body'} color={'white'}>
                                {`${wallet.currency.name} (${wallet.currency.ticker})`}
                            </Typography>
                            <div styleName='text-description'>
                                <Typography variant={'x-small-body'} color={'casper'}>
                                    {`${formatCurrency(wallet.playBalance)} ${wallet.currency.ticker}`}
                                </Typography>
                            </div>
                            {price ? 
                                <div styleName='text-description'>
                                    <Typography variant={'x-small-body'} color={'mercury'}>
                                        {`1 ${virtualTicker} = ${price} ${wallet.currency.ticker}`}
                                    </Typography>
                                </div>
                            : null}
                        </div>
                    </Col>
                </Row>
            </button>
        )
    }
}

function mapStateToProps(state){
    return {
        deposit : state.deposit
    };
}

export default connect(mapStateToProps)(PaymentBox);

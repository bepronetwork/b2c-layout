import React from "react";
import './index.css';
import { Row, Col } from 'reactstrap';
import { Typography, Button } from 'components';
import { connect } from "react-redux";
import classNames from 'classnames';
import { getApp } from "../../lib/helpers";
import { formatCurrency } from '../../utils/numberFormatation';
import _ from 'lodash';

class PaymentBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked : false,
            price : null,
            virtualTicker: null,
            walletImage: null,
            isActiveTimer: false
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

            if(wallet.currency.virtual !== true && virtualCurrency) {
                const virtualWallet = getApp().wallet.find(w => w.currency._id === virtualCurrency._id);
                const price = virtualWallet ? virtualWallet.price.find(p => p.currency === wallet.currency._id).amount : null;
                this.setState({ price, virtualTicker : virtualCurrency.ticker });
            }
        }

        const appWallet = getApp().wallet.find(w => w.currency._id === wallet.currency._id);

        this.setState({
            walletImage : _.isEmpty(appWallet.image) ? wallet.currency.image : appWallet.image
        });

    }

    onClick = () => {
        const { id, onClick } = this.props;
        if(onClick){
            onClick(id)
        }
    }

    render(){
        let { isPicked, wallet} = this.props;
        const { price, virtualTicker, walletImage, isActiveTimer } = this.state;
        const styles = classNames("container-root", {
            selected: isPicked
        });

        return (
            <button onClick={this.onClick} styleName={styles} disabled={wallet.currency.virtual}>
                <Col>
                <Row>
                    <Col xs={4} md={4}>
                        <div styleName='container-image'>
                            <img src={walletImage} styleName='payment-image'/>
                        </div>
                    </Col>
                    <Col xs={8} md={8}>
                        <div styleName={'container-text'}>
                            <Typography variant={'small-body'} color={'white'}>
                                {`${wallet.currency.name} (${wallet.currency.ticker})`}
                            </Typography>
                            <div styleName='text-description'>
                                <Typography variant={'x-small-body'} color={'white'}>
                                    {`${formatCurrency(wallet.playBalance)} ${wallet.currency.ticker}`}
                                </Typography>
                            </div>
                            {price ? 
                                <div styleName='text-description'>
                                    <Typography variant={'x-small-body'} color={'white'}>
                                        {`1 ${virtualTicker} = ${price} ${wallet.currency.ticker}`}
                                    </Typography>
                                </div>
                            : null}
                        </div>
                    </Col>
                </Row>
                {
                    isActiveTimer === false ?
                        <div styleName="bottom-line">
                            <Col xs={4} md={4} styleName="button-padding">
                                <div styleName="border-radius" />
                            </Col>
                            <Col xs={8} md={8} styleName="button-padding">
                                <Button size={'x-small'} theme={'action'}>
                                    <Typography color={'white'} variant={'small-body'}>Replanish</Typography>
                                </Button>
                            </Col>
                        </div> 
                    : null
                }
                </Col>
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

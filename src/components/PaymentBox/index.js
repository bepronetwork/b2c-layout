import React from "react";
import './index.css';
import { Row, Col } from 'reactstrap';
import { Typography, Checkbox } from 'components';
import { connect } from "react-redux";
import { getApp } from "../../lib/helpers";

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
        const { currency } = props;
        const virtual = getApp().virtual;

        if (virtual === true) {
            const virtualCurrency = getApp().currencies.find(c => c.virtual === true);

            if(currency && virtualCurrency) {
                const virtualWallet = getApp().wallet.find(w => w.currency._id === virtualCurrency._id);
                const price = virtualWallet ? virtualWallet.price.find(p => p.currency === currency._id).amount : null;
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
        var { 
            image, type, description, id, picked, isPicked, info
        } = this.props;
        const { price, virtualTicker } = this.state;

        isPicked = isPicked ? isPicked : (picked == id);

        return (
            <button onClick={this.onClick} styleName={`container-root`}>
                <Row>
                    <Col xs={3} md={3}>
                        <div styleName='container-image'>
                            <img src={image} styleName='payment-image'/>
                        </div>
                    </Col>
                    <Col xs={5} md={7}>
                        <div styleName={'container-text'}>
                            <Typography variant={'body'} color={'white'}>
                                {type}
                            </Typography>
                            <div styleName='text-description'>
                                <Typography variant={'x-small-body'} color={'casper'}>
                                    {price ? `1 ${virtualTicker} = ${price} ${id}` : description}
                                </Typography>
                            </div>
                            {info ? 
                                <div styleName='text-description'>
                                    <Typography variant={'x-small-body'} color={'mercury'}>
                                        {info}
                                    </Typography>
                                </div>
                            : null}
                        </div>
                    </Col>
                    <Col xs={4} md={2}>
                        <div>
                            <Checkbox isSet={isPicked} id={id}/>
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

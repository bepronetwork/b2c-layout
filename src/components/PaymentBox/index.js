import React from "react";
import './index.css';
import { Row, Col } from 'reactstrap';
import { Typography, Checkbox } from 'components';
import { connect } from "react-redux";

class PaymentBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked : false
        }
    }

    onClick = () => {
        const { id, onClick } = this.props;
        if(onClick){
            onClick(id)
        }
    }

    render(){
        var { 
            image, type, time, description, id, picked, isPicked,  disabled, alertMessage, alertCondition, info
        } = this.props;

        isPicked = isPicked ? isPicked : (picked == id);

        return (
            <button disabled={disabled} onClick={this.onClick} styleName={`container-root ${isPicked ? 'picked' : ''} ${alertCondition ? 'alert' : ''} ${info ? 'alert' : ''}`}>
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
                            <Typography variant={'x-small-body'} color={'green'}>
                                {time}
                            </Typography>
                            <div styleName='text-description'>
                                <Typography variant={'x-small-body'} color={'casper'}>
                                    {description}
                                </Typography>
                            </div>
                            {alertCondition ? 
                                <div styleName='text-description'>
                                    <Typography variant={'x-small-body'} color={'red'}>
                                        {alertMessage}
                                    </Typography>
                                </div>
                            : null}
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

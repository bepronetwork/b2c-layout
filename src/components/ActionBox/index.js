import React from "react";
import { Row, Col } from 'reactstrap';
import { Typography, Checkbox } from 'components';
import { connect } from "react-redux";
import './index.css';
import loading from 'assets/loading.gif';

class ActionBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked : false
        }
    }

    onClick = () => {
        const { onClick } = this.props;
        if(onClick){onClick()}
    }

    render(){
        const { 
            id, image, description, title, completed, onLoading, loadingMessage, disabled, alertMessage, alertCondition
        } = this.props;
        return (
            <button disabled={completed || onLoading || disabled} onClick={this.onClick}
                styleName={`container-root ${completed ? 'picked' : ''} ${(completed || onLoading || disabled) ? 'nohover' : ''} ${onLoading ? 'onLoading' : ''}${alertCondition ? 'alert' : ''}`}>
                <Row>
                    <Col xs={3} md={3}>
                        <div styleName='container-image'>
                            <img src={image} styleName='payment-image' alt="Payment" />
                        </div>
                    </Col>
                    <Col xs={5} md={7}>
                        <div styleName={'container-text'}>
                            <Typography variant={'body'} color={'white'}>
                                {title}
                            </Typography>
                            {onLoading ?
                                    <div styleName='text-description '>
                                        <Typography variant={'small-body'} color={'mercury'}>
                                            {loadingMessage}
                                        </Typography>
                                    </div>
                            : null}
                            <div styleName='text-description '>
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
                        </div>
                    </Col>
                    <Col xs={4} md={2}>
                        <div>
                            {
                                !onLoading
                            ?
                                <Checkbox isSet={completed} id={id}/>
                            : 
                                <img src={loading} styleName='loading-gif' alt="Loading" />
                            }
                        </div>
                    </Col>
                </Row>
            </button>
        )
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        deposit : state.deposit
    };
}

export default connect(mapStateToProps)(ActionBox);

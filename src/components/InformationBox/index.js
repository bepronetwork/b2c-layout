import React from "react";
import { Row, Col } from 'reactstrap';
import { Typography } from 'components';
import { connect } from "react-redux";
import './index.css';
import CloseCircleIcon from 'mdi-react/CloseCircleIcon';

const copy = {
    'alert' : {
        title : 'You can´t Procceed!'
    },
    'info' : {
        title : 'Information'
    }
}

class InformationBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            closed : false
        }
    }

    close = () => {
        this.setState({closed : true});
    }

    render(){
        const { 
            message, image, type='alert'
        } = this.props;
        const { closed } = this.state;

        let isAlert = (type === 'alert');
        let isInfo = (type === 'info');

        let title = copy[type].title;
        if(closed){return null}

        return (
            <div styleName={`container-root ${isAlert ? 'alert' : ''}`}>
                <button styleName='close-button' onClick={this.close}><CloseCircleIcon color={'white'} size={20}/></button>
                <Row>
                    <Col xs={12} md={3}>
                        <div styleName='container-image'>
                            <img src={image} styleName='payment-image' alt="Payment" />
                        </div>
                    </Col>
                    <Col xs={12} md={9}>
                        <div styleName={'container-text'}>
                            <Typography variant={'body'} color={`${isAlert ? 'red' : ''} ${isInfo ? 'casper' : ''}`}>
                               {title}
                            </Typography>
                            <div styleName='text-message'>
                                <Typography variant={'x-small-body'} color={'white'}>
                                    {message}
                                </Typography>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}


function mapStateToProps(state){
    return {
        profile : state.profile
    };
}

export default connect(mapStateToProps)(InformationBox);

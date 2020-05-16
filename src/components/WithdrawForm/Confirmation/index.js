import React, { Component } from "react";
import { Checkbox, Typography } from "../../../components";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { CopyText } from '../../../copy';
import _ from 'lodash';
import "../index.css";

const defaultProps = {
    isConfirmed: false
}

class Confirmation extends Component {

    constructor(props){
        super(props);
        this.state = { ...defaultProps };
    }

    componentDidMount(){
    }

    onHandlerConfirm() {
        const { isConfirmed } = this.state;
        const { onConfirmed } = this.props;

        if(onConfirmed) { 
            onConfirmed(!isConfirmed) 
        }; 

        this.setState({ isConfirmed : !isConfirmed });
    }

    render() {
        const {ln} = this.props;
        const { isConfirmed } = this.state;
        const copy = CopyText.amountFormIndex[ln];

        return (
            <div styleName="main">
                <div>
                    <Typography variant='small-body' color={"red"}>
                        {copy.INDEX.DISCLAIMER.CONFIRM_DESC}
                    </Typography>
                </div>
                <div styleName="confirm">
                    <div styleName="check">
                        <Checkbox onClick={() => this.onHandlerConfirm()} isSet={isConfirmed} id={'isConfirmed'}/>
                    </div>
                    <div styleName="check-text">
                        <Typography variant='small-body' color={"grey"}>
                            {copy.INDEX.DISCLAIMER.CONFIRM}
                        </Typography>
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state){
    return {
        profile : state.profile,
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(Confirmation);

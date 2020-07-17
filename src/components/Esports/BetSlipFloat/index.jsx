import React, { Component } from "react";
import { connect } from 'react-redux';
import { BetSlip } from "components/Esports";
import { BetsIcon } from "components";
import classNames from "classnames";
import _ from 'lodash';
import "./index.css";


class BetSlipFloat extends Component {

    constructor(props){
        super(props);
        this.state = {
            expand: false
        };
    }

    expandClick() {
        const { expand } = this.state;

        this.setState({
            expand: !expand
        })
    }

    render() {
        const { expand } = this.state;

        const styles = classNames("wrapper", {
            "betExpandDisplay": expand,
            "betCollapseDisplay": !expand
        });

        return (
            <div styleName="bet-slip">
                <div styleName={styles}>
                    <div styleName="top">
                        <div styleName="icon" onClick={() => this.expandClick()}>
                            <BetsIcon/>
                        </div>
                    </div>
                    <div styleName="bets">
                    {
                        expand == true
                        ?
                            <BetSlip  />
                        :
                            <BetSlip showBetSlip={false}/>
                    }
                     </div>
                </div>
            </div>
        )

    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(BetSlipFloat);
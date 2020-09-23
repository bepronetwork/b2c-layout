import React from "react";
import { connect } from "react-redux";
import { BigWinIcon, Typography } from "components";
import { getIcon } from "../../lib/helpers";

import './index.css';

class Jackpot extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
    }

    render(){
        const { message } = this.props;
        const bigWinIcon = getIcon(26);

        return (
            <div styleName="root">
                <div styleName="jackpot">
                    <Typography variant="h1" weight="semi-bold" color="fixedwhite">
                        {"Congratulations!!!"}
                    </Typography>
                    {bigWinIcon === null ? <BigWinIcon /> : <img src={bigWinIcon} />}
                    <Typography variant="h1" weight="semi-bold" color="fixedwhite">
                        {message}
                    </Typography>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
}

export default connect(mapStateToProps)(Jackpot);

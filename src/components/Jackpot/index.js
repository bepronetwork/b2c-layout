import React from "react";
import { BigWinIcon, Typography } from "components";
import { getIcon } from "../../lib/helpers";
import './index.css';

class Jackpot extends React.Component{
    render(){
        const { message } = this.props;
        const bigWinIcon = getIcon(26);

        return (
            <div styleName="root">
                <div styleName="jackpot">
                    <Typography variant="h1" weight="semi-bold" color="fixedwhite">
                        {"Congratulations!!!"}
                    </Typography>
                    {bigWinIcon === null ? <BigWinIcon /> : <img src={bigWinIcon} alt="Big Win" />}
                    <Typography variant="h1" weight="semi-bold" color="fixedwhite">
                        {message}
                    </Typography>
                </div>
            </div>
        )
    }
}

export default Jackpot;

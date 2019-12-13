import React, { Component } from "react";
import { Tabs, Typography } from "components";

import "./index.css";

export default class Actions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { rulesLabel, game } = this.props;

        return (
        <div styleName="root" style={{ overflowY: 'auto', overflowX : 'hidden'}}>
            <div >
            <Tabs
                options={[
                {
                    value: "rules",
                    label: rulesLabel
                }
                ]}
            />
            </div>
            <div styleName="root" style={{ overflowY: 'auto', overflowX : 'hidden'}}>
                <div styleName="rule">
                    <h1>
                        <img styleName="image-icon" src={game.image_url}/> 
                        <Typography variant='x-small-body' color={"grey"}> {game.name} </Typography>
                    </h1>
                    <div styleName="content">
                        <Typography color={'grey'} variant={'small-body'}>
                            {game.rules}
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

import React, { Component } from "react";
import { Tabs, Typography } from "components";

import "./index.css";

export default class Actions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { rules } = this.props;

        return (
        <div styleName="root" style={{ overflowY: 'auto', overflowX : 'hidden'}}>
            <div >
            <Tabs
                options={[
                {
                    value: "rules",
                    label: rules.title
                }
                ]}
            />
            </div>
            <div styleName="root" style={{ overflowY: 'auto', overflowX : 'hidden'}}>
                <Typography color={'white'} variant={'small-body'}>
                    {rules.content}
                </Typography>
            </div>
        </div>
        );
    }
}

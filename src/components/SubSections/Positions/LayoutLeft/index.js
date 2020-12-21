import React, { Component } from "react";
import { Typography } from "components";
import "./index.css";

class LayoutLeft extends Component {

    constructor(props){
        super(props);
    }

    render() {
        const { data } = this.props;

        return (
            <div styleName="sub-section">
                <div styleName="text" style={{ backgroundColor: data.background_color }}>
                    <div styleName="fields">
                        <Typography color={'white'} variant={'h4'}>{data.title}</Typography>
                    </div>
                    <div styleName="fields">
                        <Typography color={'white'} variant={'small-body'}>{data.text}</Typography>
                    </div>
                </div>
                <div styleName="image" style={{ background: data.image_url ? 'url(' + data.image_url + ') center center / cover no-repeat' : null }}/>
            </div>
        );
    }
}

export default LayoutLeft;

import React, { Component } from "react";
import classNames from "classnames";
import Tooltip from '@material-ui/core/Tooltip';
import "./index.css";

export default class Shield extends Component {

    render() {
        const { image, size, tooltip, isFull } = this.props;
        const rootStyles = classNames("root", {
            "root-small" : size == "small",
            "root-medium": size == "medium",
            "root-large" : size == "large",
            "root-full"  : size == "full"
        });

        const shieldStyles = classNames("shield", {
            "shield-full"  : isFull == true
        });

        return (
            <div styleName={rootStyles}>
                {
                    tooltip != null
                    ?
                        <Tooltip title={tooltip}>
                            <span styleName={shieldStyles} style={{ backgroundImage: "url(" + image + ")" }} />
                        </Tooltip>
                    :
                        <span styleName={shieldStyles} style={{ backgroundImage: "url(" + image + ")" }} />
                }
            </div>
        );
    }
}
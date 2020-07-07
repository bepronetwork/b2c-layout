import React, { Component } from "react";
import classNames from "classnames";
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';
import "./index.css";


export default class Shield extends Component {

    render() {
        const { image, size, tooltip } = this.props;
        const rootStyles = classNames("root", {
            "root-small" : size == "small",
            "root-medium": size == "medium",
            "root-large" : size == "large"
        });

        return (
            <div styleName={rootStyles}>
                {
                    tooltip != null
                    ?
                        <Tooltip title={tooltip}>
                            <span styleName={"shield"} style={{ backgroundImage: "url(" + image + ")" }} />
                        </Tooltip>
                    :
                        <span styleName={"shield"} style={{ backgroundImage: "url(" + image + ")" }} />
                }
            </div>
        );
    }
}
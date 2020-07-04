import React, { Component } from "react";
import classNames from "classnames";
import _ from 'lodash';
import "./index.css";


export default class Shield extends Component {

    render() {
        const { image, size } = this.props;
        const styles = classNames("shield", {
            "small" : size == "small",
            "medium": size == "medium",
            "large" : size == "large"
        });

        return (
            <div styleName={styles} style={{ backgroundImage: "url(" + image + ")" }} />
        );
    }
}
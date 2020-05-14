import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { includes } from "lodash";

import "./index.css";

const Typography = ({ children, variant, color, weight, otherStyles={}}) => {
    const styles = classNames({
        [variant]: true,
        [color]: true,
        [weight]: true
    });
    const TextComponent = includes(variant, "body") ? "p" : variant;

    return <TextComponent style={otherStyles}  styleName={styles}>{children}</TextComponent>;
};

Typography.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf([
        "h1",
        "h2",
        "h3",
        "h4",
        "body",
        "small-body",
        "x-small-body"
    ]),
    color: PropTypes.oneOf([
        "gable-green",
        "pickled-bluewood",
        "casper",
        "mercury",
        "white",
        "red",
        "green",
        "grey",
        "fixedwhite"
    ]),
    weight: PropTypes.oneOf(["regular", "semi-bold", "bold"]),
};

Typography.defaultProps = {
    variant: "body",
    color: "gable-green",
    weight: "regular"
};

export default Typography;

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Typography } from "components";
import classNames from "classnames";
import { connect } from "react-redux";

import "./index.css";
import { CopyText } from "../../copy";

class GameCard extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        edge: PropTypes.number,
        image: PropTypes.string,
        path: PropTypes.string.isRequired,
        children: PropTypes.node.isRequired,
        width: PropTypes.string,
    };

    static defaultProps = {
        edge: null,
        image: "",
        width: null,
        color: "firefly"
    };

    renderImage = () => {
        const { image } = this.props;

        if (!image) {
        return <div styleName="image-container" />;
        }

        return (
        <div styleName="image-container">
            <img alt="menu" src={image} />
        </div>
        );
    };

    render() {
        const { title, edge, path, image_url, tableLimit, ln } = this.props;
        const copy = CopyText.shared[ln];
        const imageStyles = "image-container dice-background-color"
        return (
            <div styleName="root">
                <Link to={path} styleName="button">
                <div styleName={imageStyles}>
                    <div styleName="icon">
                        <img src={image_url} styleName='coinflip-icon'/>
                    </div>
                </div>
                <div styleName="labels">
                    <div styleName="title">
                    <Typography variant="body" weight="semi-bold" color="white">
                        {title}
                    </Typography>
                    </div>
                    <div styleName='info-holder'>
                        <Typography variant="small-body" color="white">
                            {edge >= 0 ? `${edge}% ${copy.EDGE_NAME}` : ""} 
                            <span>
                                <Typography variant="x-small-body" color="grey">Min: 0.01</Typography>
                            </span>
                            <span>
                                <Typography variant="x-small-body" color="grey">Max: {tableLimit}</Typography>
                            </span>
                        </Typography>
                    </div>
                </div>
                </Link>
            </div>
        );
    }
}


function mapStateToProps(state){
    return {
        ln : state.language
    };
}

export default connect(mapStateToProps)(GameCard);

import React, { Component } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Typography, Button } from "components";
import { connect } from "react-redux";
import classNames from "classnames";
import _ from "lodash";
import { getAppCustomization } from "../../lib/helpers";
import "./index.css";

class Banners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banners: [],
      index: 0,
      isFullWidth: false
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  componentWillReceiveProps(props) {
    this.projectData(props);
  }

  projectData = async props => {
    const { ln } = props;
    let { banners } = getAppCustomization();

    banners = banners.languages.find(
      ({ language }) =>
        language.isActivated === true && language.prefix === ln.toUpperCase()
    );

    this.setState({
      banners: !_.isEmpty(banners) ? banners.ids : null,
      isFullWidth: !_.isEmpty(banners) ? banners.fullWidth : false
    });
  };

  handleSelect(selectedIndex) {
    this.setState({ index: selectedIndex });
  }

  handleClick(url) {
    window.location.assign(url);
  }

  render() {
    const { banners, index, isFullWidth } = this.state;
    const skin = getAppCustomization().skin.skin_type;

    if (_.isEmpty(banners)) {
      return null;
    }

    return (
      <div
        styleName={classNames("banners", {
          "banners-full-width": isFullWidth
        })}
      >
        <Carousel
          activeIndex={index}
          onSelect={this.handleSelect}
          pause="hover"
        >
          {banners.map(
            ({ title, subtitle, image_url, link_url, button_text }) => (
              <Carousel.Item>
                <div
                  styleName={classNames(
                    "banner",
                    { "banner-full": isFullWidth },
                    { "banner-without-text": !title && !subtitle }
                  )}
                  style={{
                    background:
                      isFullWidth || (!isFullWidth && !title && !subtitle)
                        ? `url(${image_url}) center center / cover no-repeat`
                        : null
                  }}
                >
                  {(title || subtitle || button_text) && (
                    <div
                      styleName={classNames("text", {
                        "text-full": isFullWidth,
                        "no-text": isFullWidth && !title && !subtitle
                      })}
                    >
                      <div>
                        <div styleName="fields">
                          <Typography color="white" variant="h3" weight="bold">
                            {title}
                          </Typography>
                        </div>
                        <div styleName="fields fields-text">
                          <Typography color="white" variant="small-body">
                            {subtitle}
                          </Typography>
                        </div>
                        {button_text && link_url && (
                          <Button
                            onClick={() => this.handleClick(link_url)}
                            theme="action"
                          >
                            <Typography
                              color={
                                skin === "digital" ? "secondary" : "fixedwhite"
                              }
                              variant="small-body"
                            >
                              {button_text}
                            </Typography>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  {!(isFullWidth || (!isFullWidth && !title && !subtitle)) && (
                    <div
                      styleName="image"
                      style={{
                        background: `url(${image_url}) center center / cover no-repeat`
                      }}
                    />
                  )}
                </div>
              </Carousel.Item>
            )
          )}
        </Carousel>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default connect(mapStateToProps)(Banners);

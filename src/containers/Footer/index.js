import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { Typography, LegalBox, LanguageSelector } from "components";
import { Link } from "react-dom";
import { connect } from "react-redux";
import "./index.css";
import { getAppCustomization, getApp } from "../../lib/helpers";
import { CopyText } from "../../copy";
import _, { uniqueId } from "lodash";
import logoMadeByBepro_light from "assets/media/logo_bepro.png";
import logoMadeByBepro_dark from "assets/media/logo_bepro-dark.png";
import logobBitGo_light from "assets/partners/logo_bitgo.png";
import logobBitGo_dark from "assets/partners/logo_bitgo-dark.png";
import logoBetProtocol_light from "assets/partners/logo_betprotocol.png";
import logoBetProtocol_dark from "assets/partners/logo_betprotocol-dark.png";
import logoBitCoin_light from "assets/partners/logo_bitcoin.png";
import logoBitCoin_dark from "assets/partners/logo_bitcoin-dark.png";
import logoEthereum_light from "assets/partners/logo_ethereum.png";
import logoEthereum_dark from "assets/partners/logo_ethereum-dark.png";
import logoResponsible_light from "assets/partners/logo_responsible_gambling.png";
import logoResponsible_dark from "assets/partners/logo_responsible_gambling-dark.png";

const arr = window.location.href.split("/");
const website = arr[2];

const footerStaticOutput = ({ props, supportLinks, communityLinks }) => {
  const info = getApp();
  const { ln } = props;
  const copy = CopyText.homepage[ln];

  return {
    info: {
      text: copy.CONTAINERS.FOOTER.INFO.TEXT[0](info.name),
      text2: copy.CONTAINERS.FOOTER.INFO.TEXT2[0](website),
      rights: copy.CONTAINERS.FOOTER.INFO.RIGHTS,
      size: "x-small-body",
      color: "grey",
    },
    tabs: [
      {
        col: 2,
        align: "left",
        show: supportLinks.length > 0,
        title: {
          color: "white",
          text: copy.CONTAINERS.FOOTER.INFO.SUPPORT,
          size: "small-body",
          weight: "semi-bold",
        },
        items: supportLinks.map((s) => {
          return {
            type: "link",
            text: s.name,
            href: s.href,
            size: "small-body",
            color: "casper",
          };
        }),
      },
      {
        col: 2,
        align: "left",
        show: communityLinks.length > 0,
        title: {
          color: "white",
          text: copy.CONTAINERS.FOOTER.INFO.COMMUNITY,
          size: "small-body",
          weight: "semi-bold",
        },
        items: communityLinks.map((s) => {
          return {
            type: "link",
            text: s.name,
            href: s.href,
            size: "small-body",
            color: "casper",
          };
        }),
      },
      {
        col: 2,
        align: "left",
        show: true,
        title: {
          color: "white",
          text: copy.CONTAINERS.FOOTER.INFO.LANGUAGE,
          size: "small-body",
          weight: "semi-bold",
        },
        items: [
          {
            type: "component",
            component: (
              <LanguageSelector
                showArrow
                key={uniqueId("footer-col-")}
                expand="bottom"
                size="small-body"
                color="casper"
              />
            ),
          },
        ],
      },
    ],
  };
};
class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supportLinks: [],
      communityLinks: [],
      logo: null,
      socialLink: [],
    };
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.projectData(props);
  }

  projectData = async (props) => {
    const { ln } = props;
    const info = getApp();
    const { footer, logo, socialLink } = getAppCustomization();

    let supportLinks = footer.languages.find(
      (f) =>
        f.language.isActivated === true &&
        f.language.prefix === ln.toUpperCase(),
    );
    supportLinks = !_.isEmpty(supportLinks) ? supportLinks.supportLinks : [];

    let communityLinks = footer.languages.find(
      (f) =>
        f.language.isActivated === true &&
        f.language.prefix === ln.toUpperCase(),
    );
    communityLinks = !_.isEmpty(communityLinks)
      ? communityLinks.communityLinks
      : [];

    this.setState({
      supportLinks,
      communityLinks,
      logo,
      info,
      socialLink: socialLink.ids,
    });
  };

  render() {
    const { supportLinks, communityLinks, logo, info, socialLink } = this.state;
    const props = this.props;
    const { ln } = this.props;
    let footerInfo = footerStaticOutput({
      props,
      supportLinks,
      communityLinks,
    });
    const copyShared = CopyText.shared[ln];

    return (
      <div styleName="container">
        <div styleName="footer">
          <Row>
            {footerInfo.tabs.map((tab) => {
              if (!tab.show) {
                return null;
              }

              if (tab.return) {
                return <Col md={tab.col}>{tab.return}</Col>;
              }

              return (
                <Col md={tab.col} key={tab.title.text}>
                  <div styleName={tab.align}>
                    {tab.title ? (
                      <div styleName="title">
                        <Typography
                          variant={tab.title.size}
                          weight={tab.title.weight}
                          color={tab.title.color}
                        >
                          {tab.title.text}
                        </Typography>
                      </div>
                    ) : null}

                    {tab.items.map((col) => {
                      switch (col.type) {
                        case "link":
                          return (
                            <a
                              styleName="item"
                              href={col.href}
                              target={"_blank"}
                              key={col.text}
                            >
                              <Typography
                                variant={col.size}
                                weight={col.weight}
                                color={col.color}
                              >
                                {col.text}
                              </Typography>
                            </a>
                          );
                        case "image":
                          return (
                            <img
                              src={col.image}
                              style={{ width: col.width }}
                              key={col.text}
                              alt={col.text}
                            />
                          );
                        case "text":
                          return (
                            <div styleName="no-hover-item" key={col.text}>
                              <Typography
                                variant={col.size}
                                weight={col.weight}
                                color={col.color}
                              >
                                {col.text}
                              </Typography>
                            </div>
                          );
                        case "route":
                          return (
                            <Link to={col.href} styleName="item" key={col.text}>
                              <Typography
                                variant={col.size}
                                weight={col.weight}
                                color={col.color}
                              >
                                {col.text}
                              </Typography>
                            </Link>
                          );
                        case "component":
                          return col.component;
                        default:
                          break;
                      }

                      return null;
                    })}
                  </div>
                </Col>
              );
            })}
          </Row>
          {socialLink.length ? (
            <div styleName="social">
              <div styleName="follow">
                <Typography color={"white"} variant={"x-small-body"}>
                  {copyShared.FOLLOW_US}
                </Typography>
              </div>
              <div styleName="social-icons">
                {socialLink.map((s) => {
                  return (
                    <div styleName="social-icon">
                      <a href={s.href} target="_blank">
                        <img src={s.image_url} alt={s.name} />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          <div styleName="footer-partners">
            <Row>
              <div className="col-md-2" styleName="col">
                <a href={"https://www.bitgo.com"} target={"_blank"}>
                  <img
                    src={
                      getAppCustomization().theme === "dark"
                        ? logobBitGo_dark
                        : logobBitGo_light
                    }
                    style={{ height: 40 }}
                    alt="Partner"
                  />
                </a>
              </div>
              <div className="col-md-2" styleName="col">
                <a href={"https://betprotocol.com"} target={"_blank"}>
                  <img
                    src={
                      getAppCustomization().theme === "dark"
                        ? logoBetProtocol_dark
                        : logoBetProtocol_light
                    }
                    style={{ height: 46 }}
                    alt="Partner"
                  />
                </a>
              </div>
              <div className="col-md-2" styleName="col">
                <a href={"https://bitcoin.org"} target={"_blank"}>
                  <img
                    src={
                      getAppCustomization().theme === "dark"
                        ? logoBitCoin_dark
                        : logoBitCoin_light
                    }
                    style={{ height: 40 }}
                    alt="Partner"
                  />
                </a>
              </div>
              <div className="col-md-2" styleName="col">
                <a href={"https://ethereum.org"} target={"_blank"}>
                  <img
                    src={
                      getAppCustomization().theme === "dark"
                        ? logoEthereum_dark
                        : logoEthereum_light
                    }
                    style={{ height: 26 }}
                    alt="Partner"
                  />
                </a>
              </div>
              <div className="col-md-2" styleName="col">
                <a href={"https://www.begambleaware.org"} target={"_blank"}>
                  <img
                    src={
                      getAppCustomization().theme === "dark"
                        ? logoResponsible_dark
                        : logoResponsible_light
                    }
                    style={{ height: 30 }}
                    alt="Partner"
                  />
                </a>
              </div>
              <div className="col-md-2" styleName="col">
                <Typography weight="bold" variant="h4" color="white">
                  18+
                </Typography>
              </div>
            </Row>
          </div>
          <div styleName="footer-info">
            <Typography
              variant={footerInfo.info.size}
              weight={footerInfo.info.weight}
              color={footerInfo.info.color}
            >
              {footerInfo.info.text}
            </Typography>
          </div>
          <div styleName="footer-info">
            <Typography
              size={footerInfo.info.size}
              color={footerInfo.info.color}
            >
              {footerInfo.info.text2}
            </Typography>
          </div>
          <div styleName="footer-logo">
            <Row>
              {logo && logo.id ? (
                <div className="col-md-3" styleName="col">
                  <img src={logo.id} style={{ width: 140 }} alt="Logos" />
                </div>
              ) : null}
              <div className="col-md-3" styleName="col">
                <Typography
                  weight="semi-bold"
                  variant="x-small-body"
                  color="grey"
                >
                  {info ? `@${new Date().getFullYear()} ${info.name}` : null}
                  <br />
                  {footerInfo.info.rights}
                </Typography>
              </div>
              {info && info.licenseID && info.isValid ? (
                <div className="col-md-3" styleName="col">
                  <LegalBox licenseID={info.licenseID} />
                </div>
              ) : null}
              <div className="col-md-3" styleName="col">
                <a href={"https://betprotocol.com"} target={"_blank"}>
                  <img
                    src={
                      getAppCustomization().theme === "dark"
                        ? logoMadeByBepro_dark
                        : logoMadeByBepro_light
                    }
                    styleName="bepro-made-by-logo"
                    alt="Made by"
                  />
                </a>
              </div>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ln: state.language,
  };
}

export default connect(mapStateToProps)(Footer);

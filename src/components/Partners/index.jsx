import React, { Component } from "react";
import image_1 from "assets/partners/cruise.png";
import image_2 from "assets/partners/genting.png";
import image_3 from "assets/partners/sands.png";
import image_4 from "assets/partners/waterfront.png";
import { Typography } from "components";
import "./index.css";
import { CopyText } from "../../copy";
import { connect } from "react-redux";

class Partners extends Component {
  render() {
    const { ln } = this.props;
    const copy = CopyText.partnersIndex[ln];

    return (
      <div styleName="partners-section">
        <Typography variant="h3" color="white" weight="bold">
          {copy.INDEX.TYPOGRAPHY.TEXT[0]}
        </Typography>
        <div styleName="container">
          <img styleName="partner-img" src={image_1} alt="Partner Logo" />
          <img styleName="partner-img" src={image_2} alt="Partner Logo" />
          <img styleName="partner-img" src={image_3} alt="Partner Logo" />
          <img styleName="partner-img" src={image_4} alt="Partner Logo" />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language,
  };
}

export default connect(mapStateToProps)(Partners);

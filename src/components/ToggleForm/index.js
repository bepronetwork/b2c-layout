import React, { Component } from "react";
import { Typography, Checkbox } from "components";
import { connect } from "react-redux";
import _ from "lodash";
import { Row, Col } from "reactstrap";
import "./index.css";

class ToggleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, description, isSet, id, onClick } = this.props;

    return (
      <div styleName="form">
        <Row>
          <Col sd={9}>
            <div styleName="text">
              <Typography variant={"body"} color={"white"}>
                {title}
              </Typography>
              <Typography variant={"small-body"} color={"grey"}>
                {description}
              </Typography>
            </div>
          </Col>
          <Col sd={3}>
            <div styleName="toggle">
              <Checkbox onClick={onClick} isSet={isSet} id={id} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile
  };
}

export default connect(mapStateToProps)(ToggleForm);

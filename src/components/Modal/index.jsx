import React from "react";
import PropTypes from "prop-types";
import keyCode from "utils/keyCode";
import CloseIcon from "components/Icons/CloseCross";
import withSetWindowListeners from "containers/withSetWindowListener";
import styles from "./index.css";

class Modal extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  componentDidMount() {
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.width = `calc(100% - ${styles.scrollWidth})`;
  }

  componentWillUnmount() {
    document.documentElement.style.overflow = null;
    document.documentElement.style.width = null;
  }

  handleOutsideClick = (event) => {
    const { onClose } = this.props;

    event.stopPropagation();

    if (onClose) onClose();
  };

  handleContentClick = (event) => {
    event.stopPropagation();
  };

  render() {
    const { children } = this.props;

    return (
      <div
        role="presentation"
        styleName="root"
        id="background"
        onClick={this.handleOutsideClick}
      >
        <div
          role="presentation"
          styleName="content"
          onClick={this.handleContentClick}
        >
          <button
            styleName="icon"
            onClick={this.handleOutsideClick}
            type="button"
          >
            <CloseIcon />
          </button>
          {children}
        </div>
      </div>
    );
  }
}

export default withSetWindowListeners(Modal, {
  keydown(event) {
    if (event.which === keyCode.ESC) {
      this.props.onClose();
    }
  },
});

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Typography, RotateIcon, UndoIcon, SoundIcon, CopyIcon } from "components";
import { getIcon } from "../../lib/helpers";
import "./index.css";

const ButtonIcon = ({
  onClick,
  icon,
  label,
  iconAtLeft,
  disabled,
  rollType,
  soundMode,
  theme
}) => {
  const rootStyles = classNames("root", {
    disabled,
    primaryTheme : theme === "primary"
  });

  const buttonStyles = classNames("button", {
    over: rollType === "over"
  });

  const rotateIcon = getIcon(31);
  const undoIcon = getIcon(30);
  const soundIcon = getIcon(13);
  const copyIcon = getIcon(27);

  const icons = {
    rotate: rotateIcon === null ? <RotateIcon color={disabled ? "pickled-bluewood" : "casper"} /> : <img src={rotateIcon} alt="Rotate" />,
    undo: undoIcon === null ? <UndoIcon color={disabled ? "pickled-bluewood" : "casper"} /> : <img src={undoIcon} alt="Undo" />,
    sound: (
      soundIcon === null ? <SoundIcon soundMode={soundMode} color={disabled ? "pickled-bluewood" : "casper"} /> : <img src={soundIcon} alt="Sound" />
    ),
    copy: (
      copyIcon === null ? <CopyIcon color={disabled ? "pickled-bluewood" : "casper"} /> : <img src={copyIcon} alt="Copy" />
    )
  };

  return iconAtLeft ? (
    <button type="button" onClick={onClick} styleName={rootStyles}>
      <div role="presentation" styleName={buttonStyles}>
        {icons[icon]}
      </div>
      {label && (
        <Typography
          weight="semi-bold"
          color={disabled ? "pickled-bluewood" : "casper"}
        >
          {label}
        </Typography>
      )}
    </button>
  ) : (
    <button type="button" onClick={onClick} styleName={rootStyles}>
      {label && (
        <Typography
          weight="semi-bold"
          color={disabled ? "pickled-bluewood" : "casper"}
        >
          {label}
        </Typography>
      )}
      <div role="presentation" styleName={buttonStyles}>
        {icons[icon]}
      </div>
    </button>
  );
};

ButtonIcon.propTypes = {
  onClick: PropTypes.func,
  iconAtLeft: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  rollType: PropTypes.oneOf(["over", "under", "sound"]),
  icon: PropTypes.string,
  soundMode: PropTypes.oneOf(["on", "off"]),
  theme: PropTypes.oneOf(["default", "primary"])
};

ButtonIcon.defaultProps = {
  onClick: null,
  iconAtLeft: false,
  disabled: false,
  label: null,
  icon: null,
  rollType: null,
  soundMode: "off",
  theme: "default"
};

export default ButtonIcon;

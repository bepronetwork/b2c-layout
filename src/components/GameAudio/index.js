import React from "react";
import propTypes from "prop-types";

const GameAudio = ({ pathSound }) => {
  return (
    <audio controls autoPlay className="player" preload="true">
      <source src={pathSound} type="audio/mp3" />
      <source src={pathSound} type="audio/ogg" />
      <source src={pathSound} type="audio/mpeg" />
      <track src="" kind="captions" srcLang="en" label="" />
    </audio>
  );
};

GameAudio.propTypes = {
  pathSound: propTypes.string.isRequired
};

export default GameAudio;

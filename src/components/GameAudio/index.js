import React from "react";
import propTypes from "prop-types";

// import { Container } from './styles';

const GameAudio = ({ pathSound }) => {
  return (
    <audio autoPlay="autoplay" className="player" preload="false">
      <source src={pathSound} />
      <track src="" kind="captions" srcLang="en" label="" />
    </audio>
  );
};

GameAudio.propTypes = {
  pathSound: propTypes.string.isRequired
};

export default GameAudio;

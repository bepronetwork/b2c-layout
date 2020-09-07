import React from "react";
import Sound from "react-sound";

export const renderSounds = urlSound => {
  window.soundManager.setup({ debugMode: false });

  return <Sound volume={80} url={urlSound} playStatus="PLAYING" autoLoad />;
};

export const handleAnimation = async (spinnerColumn, iterations) => {
  const box = document.getElementById(spinnerColumn);

  box.animate(
    [
      { transform: "translate3D(0, -30px, 0)" },
      { transform: "translate3D(0, 600px, 0)" },
      { transform: "translate3D(0, 30px, 0)" }
    ],
    {
      duration: 500,
      iterations
    }
  );

  return new Promise(resolve => setTimeout(() => resolve(), 100));
};

export const randomNumber = (min, max) => {
  const result = Math.floor(Math.random() * (max - min) + min);

  return result;
};

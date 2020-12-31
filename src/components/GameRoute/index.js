import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { find } from "lodash";
import Cache from "../../lib/cache/cache";

function GameRoute({ path = "", ...props }) {
  const appInfo = Cache.getFromCache("appInfo");
  const isGameAvailable = (path) => {
    if (!appInfo) {
      return null;
    }

    return find(appInfo.games, { path });
  };

  if (isGameAvailable) {
    return <Route exact path={`/${path}`} {...props} />;
  }

  return null;
}

GameRoute.propTypes = {
  path: PropTypes.string.isRequired,
};

export default GameRoute;

import React, { Component } from "react";
import each from "lodash/each";
import mapValues from "lodash/mapValues";

const SetWindowListeners = (
  ComposedComponent,
  windowListeners,
  otherListeners = []
) => {
  class WindowListenable extends Component {
    componentDidMount() {
      each(windowListeners, (callback, eventName) => {
        window.addEventListener(eventName, callback.bind(this));
      });
    }

    componentWillUnmount() {
      each(windowListeners, (callback, eventName) => {
        window.removeEventListener(eventName, callback.bind(this));
      });
    }

    boundListeners() {
      return mapValues(otherListeners, (listener) => listener.bind(this));
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          {...this.state}
          {...this.boundListeners()}
        />
      );
    }
  }

  return WindowListenable;
};

export default SetWindowListeners;

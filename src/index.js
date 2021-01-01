import React, { Component } from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./containers/App";
import { ping } from "./lib/api/app";
import store from "./containers/App/store";
import CountryRestrictedPage from "./containers/CountryRestrictedPage";

class Main extends Component {
  state = {
    status: null,
  };

  async componentDidMount() {
    const status = await ping();

    this.setState({ status });
  }

  renderContent({ status = 0 } = {}) {
    switch (status) {
      case 200:
        return <App />;
      case 59:
        return <CountryRestrictedPage />;
      default:
        return null;
    }
  }

  render() {
    const { status } = this.state;

    return (
      <Provider store={store}>
        <AppContainer>
          <BrowserRouter>{this.renderContent({ status })}</BrowserRouter>
        </AppContainer>
      </Provider>
    );
  }
}

export default Main;

ReactDOM.render(<Main />, document.getElementById("root"));

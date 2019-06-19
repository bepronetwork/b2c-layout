import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { BrowserRouter } from "react-router-dom";
import App from "./containers/App";
import store from "./containers/App/store";
import { Provider } from 'react-redux';


ReactDOM.render(
    <Provider store={store}>
        <AppContainer>
            <BrowserRouter>
            <App />
            </BrowserRouter>
        </AppContainer>
    </Provider>,
    document.getElementById("root")
);

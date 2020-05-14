import React, { Component } from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { BrowserRouter } from "react-router-dom";
import App from "./containers/App";
import { ping } from "./lib/api/app";
import store from "./containers/App/store";
import CountryRestrictedPage from "./containers/CountryRestrictedPage";
import { Provider } from 'react-redux';

class Main extends Component {
    constructor() {
      super();
      this.state = { status: null };
    }
  
    async componentDidMount() {
      const status = await ping();
      this.setState( { status } );
    }
  
    render() {
        const { status } = this.state;

        return (
            <Provider store={store}>
                <AppContainer>
                    <BrowserRouter>
                    {status === 200 ?
                        <App />
                        
                    :
                        status === 59 ?
                            <CountryRestrictedPage/>
                        :
                            null
                    }
                    </BrowserRouter>
                </AppContainer>
            </Provider>
        );
    }
}

export default Main;

ReactDOM.render(<Main />, document.getElementById("root"));

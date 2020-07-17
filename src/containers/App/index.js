import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { find } from "lodash";
import CasinoHomePage from "containers/Casino";
import EsportsHomePage from "containers/Esports";
import EsportsMatchPage from "containers/Esports/MatchPage";
import EsportsMatchesPage from "containers/Esports/AllMatches";
import { SerieFilterMore } from "components/Esports";
import HomePage from "containers/HomePage";
import Footer from "../Footer";
import ResetPassword from "containers/ResetPassword";
import ConfirmEmail from "containers/ConfirmEmail";
import {
    BottomNavbar,
    Navbar,
    Modal,
    Tabs,
    LoginForm,
    RegisterForm,
    CashierForm,
    ChatIcon,
    NotificationForm,
    Widgets,
    AffiliateWithdrawForm,
    Authentication2FAModal,
    PopupForm,
    BetDetails,
    Jackpot
} from "components";

import PlinkoPage from "containers/PlinkoPage";
import DicePage from "containers/DicePage";
import FlipPage from "containers/FlipPage";
import RoulettePage from "containers/RoulettePage";
import WheelPage from "../WheelPage";
import WheelVariation1 from "../WheelVariation1Page";
import KenoPage from "../KenoPage";

import { login, login2FA, logout, register } from "lib/api/users";
import getAppInfo from "lib/api/app";
import handleError from "lib/api/handleError";
import User from "controllers/User/User";
import UserContext from "./UserContext";
import "./index.css";
import { setProfileInfo } from "../../redux/actions/profile";
import { setModal } from "../../redux/actions/modal";
import store from "./store";
import Cache from "../../lib/cache/cache";
import ChatPage from "../Chat";
import LastBets from "../LastBets/HomePage";
import { CopyText } from "../../copy";
import { setCurrencyView } from "../../redux/actions/currency";
import { setWithdrawInfo } from "../../redux/actions/withdraw";

import { connect } from 'react-redux';
import _ from 'lodash';
import { setStartLoadingProcessDispatcher } from "../../lib/redux";
import AccountPage from "../AccountPage";
import { getQueryVariable, getAppCustomization, getWebsite } from "../../lib/helpers";
import ChatChannel from "../../controllers/Chat";
import AnnouncementTab from "../../components/AnnouncementTab";
import { getCurrencyAddress } from "../../lib/api/users";
import classNames from "classnames";
import delay from 'delay';
import MobileMenu from "../../components/MobileMenu";

const history = createBrowserHistory();
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading : true,
            has2FA : false,
            registerLoginModalOpen: null,
            cashierOpen: null,
            error: null,
            has2FA : false,
            tableDetails : null,
            resetPasswordOpen : null,
            resetPasswordParams : null,
            resetPasswordMode : null,
            confirmEmailOpen: null,
            confirmEmailParams : null,
            chatMobileOpen : false,
            betsListOpen : false,
            settingsMenuOpen : false,
            chatExpand : true,
            tableDetailsOpen : null
        }
    }

    componentDidMount = () => {
        this.asyncCalls();
        this.getQueryParams();
    };

    getQueryParams = () => {
        const ref = getQueryVariable('ref');
        Cache.setToCache('affiliate', ref);
    }

    start = async () => {
        this.setState({...this.state, isLoading : false});
    }


    closeStaticLoading = () => {
        document.getElementById("loading").style.display = "none";
        document.getElementById("back").style.display = "none";
    }

	asyncCalls = async () => {
        try{
            /* Get App Info */
            await this.updateAppInfo();
            //await this.loginAccount();
            await this.automaticLoginFromCache();
            await delay(1000);
            this.closeStaticLoading();
        }catch(err){
            console.log(err);
            const app = Cache.getFromCache("appInfo");
            const { publicKey } = app.integrations.chat;
            this.chat = new ChatChannel({publicKey});
            this.chat.__init__();
            setStartLoadingProcessDispatcher(6);
        }
        
        this.start();
    }

    automaticLoginFromCache = async () => {
        let reponseUser = Cache.getFromCache('user');

        if(reponseUser) {
            let user = await this.reloadUser(reponseUser);
            await user.updateUser();
            await this.setDefaultCurrency();
        }
        else {
            const app = Cache.getFromCache("appInfo");
            const { publicKey } = app.integrations.chat;
            this.chat = new ChatChannel({publicKey});
            this.chat.__init__();
            setStartLoadingProcessDispatcher(6);
        }
    }

    setDefaultCurrency = async () => {
        const appInfo = Cache.getFromCache("appInfo");
        if(appInfo && appInfo.wallet) {
            const virtual = appInfo.virtual;
            const wallets = appInfo.wallet.filter(w => w.currency.virtual === virtual);

            if(wallets.length) {
                const currency = wallets[0].currency;
                await store.dispatch(setCurrencyView(currency));
            }
        }
    }

    loginAccount = async () => {
        // Get App Ino    
        try{
            let cache = Cache.getFromCache('Authentication');
            if(cache && cache.password){
                let res = await this.handleLogin({
                    username : cache.username, 
                    password : cache.password
                });
                if(!res || (res.status != 200)){throw new Error('Login didn´t work')}
            }else{
                throw new Error('Login didn´t work')
            }
        }catch(err){
            // TO DO
            throw err;
		}

    }

    handleRegisterLoginModalClose = () => {
        this.setState({ registerLoginModalOpen: null, error: null, has2FA: false });
    };

    handleResetPasswordModalClose = async () => {
        this.setState({ resetPasswordOpen: null, resetPasswordParams: null, resetPasswordMode: null });
    };

    handleConfirmEmailModalClose = async () => {
        this.setState({ confirmEmailOpen: null, confirmEmailParams: null });
    };

    handleCashierModalClose = async () => {
        await store.dispatch(setWithdrawInfo({key : "toAddress", value : null}));
        await store.dispatch(setWithdrawInfo({key : "amount", value : null}));
        this.setState({ cashierOpen: null });
    };

    handleTableDetailsModalClose = async () => {
        this.setState({ tableDetailsOpen: null });
    };
    
    handleAccountModalClose = () => {
        this.setState({ accountInfoOpen: null });
    };

    handleJackpotModalClose = async () => {
        await store.dispatch(setModal({key : 'JackpotModal', value : null}));
    };  

    handleTabChange = name => {
        this.setState({ registerLoginModalOpen: name, error: null });
    };

    handleLoginOrRegisterOpen = tab => {
        this.setState({ registerLoginModalOpen: tab, has2FA: false, error: null });
    };

    handleResetPasswordOpen = ({params, mode}) => {
        this.setState({ resetPasswordOpen: true, resetPasswordParams : params, resetPasswordMode : mode });
    };

    handleConfirmEmailOpen = ({params}) => {
        this.setState({ confirmEmailOpen: true, confirmEmailParams : params });
    };

    handleCashierOpen = () => {
        this.setState({ cashierOpen: true });
    };

    handleTableDetailsOpen = (params) => {
        this.setState({ tableDetailsOpen: true, tableDetails: params });
    };

    handleChatOpen = () => {
        const { chatMobileOpen } = this.state;

        this.setState({ chatMobileOpen: !chatMobileOpen, betsListOpen: false, settingsMenuOpen: false });
    };

    handleBetsListOpen = () => {
        const { betsListOpen } = this.state;

        this.setState({ betsListOpen: !betsListOpen, chatMobileOpen: false, settingsMenuOpen: false });
    };

    handlSettingsMenuOpen = () => {
        const { settingsMenuOpen } = this.state;

        this.setState({ settingsMenuOpen: !settingsMenuOpen, chatMobileOpen: false, betsListOpen: false });
    };

    handleHomeOpen = ({history}) => {
        this.setState({ chatMobileOpen: false, betsListOpen : false, settingsMenuOpen: false });
        history.push('/');
    }

    handleAccountOpen = ({history}) => {
        history.push('/settings');
    }

    handleOpenMenuItem = ({history, path}) => {
        this.setState({ chatMobileOpen: false, betsListOpen : false, settingsMenuOpen: false });
        history.push(path);
    }

    handleLogin = async form => {
        try {
            this.setState({ error: null });
            const response = await login(form);    
            Cache.setToCache('Authentication', form);
            if (response.status != 200) {
                let has2FA = (response.status === 37) ? true : false;
                this.setState({ error: response.status, has2FA });
            }else{
                let user = await this.updateUser(response);
                await user.updateUser();
                this.setState({ registerLoginModalOpen: null, error: null});
            }
            /* Set currency */
            this.setDefaultCurrency();

            return response;
        } catch (error) {
            handleError(error);
            return false;
        }
    };

    handleLogin2FA = async form => {
        try {
            this.setState({ error: null });
            const response = await login2FA(form);
            Cache.setToCache('Authentication', form);
            if (response.status != 200) {
                let has2FA = (response.status === 36) ? true : false;
                this.setState({ error: response.status, has2FA });
            }else{
                let user = await this.updateUser(response);
                await user.updateUser();
                this.setState({ registerLoginModalOpen: null, error: null, has2FA: false });
            }
            /* Set currency */
            if(response.wallet && response.wallet.length > 0 && response.wallet[0].currency) {
                let currency = response.wallet[0].currency;
                await store.dispatch(setCurrencyView(currency));
            }
            return response;
        } catch (error) {
            handleError(error);
            return false;
        }
    };

    handleRegister = async form => {
        try {
            this.setState({ error: null });
            const response = await register(form);
            if (response.status !== 200) { return this.setState({ error: response }); }

            await this.handleLogin({username : form.username, password : form.password});
            const { user, app } = this.state;
            if (user) {
                const currencies = app.currencies;
                const bearerToken = user.bearerToken;
                Promise.all(currencies.map( async c => {
                    let currency = c._id;
                    getCurrencyAddress({ currency, id : response.id, app : app.id }, bearerToken);
                }));
            }
        } catch (error) {
            return handleError(error);
        }
    };

    updateUser = async user => {
        
        /* Destory Unlogged Chat Instance */
        if(this.chat){
            await this.chat.kill();
            this.chat = null;
        }

        const appInfo = this.state.app;

        let userObject = new User({
            app : appInfo,
            platformAddress: appInfo.platformAddress,
            tokenAddress: appInfo.platformTokenAddress,
            decimals: appInfo.decimals,
            integrations : user && user.integrations ? user.integrations : appInfo.integrations,
            appId: appInfo.id,
            userId: user ? user.id : null,
            user : user
        })
        await store.dispatch(setProfileInfo(userObject));
        Cache.setToCache('user', userObject)
        
        this.setState({
            user: userObject
        });
        return userObject;
    };

    reloadUser = async user => {
        
        /* Destory Unlogged Chat Instance */
        if(this.chat){
            await this.chat.kill();
            this.chat = null;
        }

        const appInfo = this.state.app;

        let userObject = new User({
            app : appInfo,
            platformAddress: appInfo.platformAddress,
            tokenAddress: appInfo.platformTokenAddress,
            decimals: appInfo.decimals,
            integrations : user && user.integrations ? user.integrations : appInfo.integrations,
            appId: appInfo.id,
            userId: user ? user.id : null,
            user : user
        })

        await store.dispatch(setProfileInfo(userObject));
        
        this.setState({ user : userObject });
        return userObject;
    };

    handleLogout = async () => {
        Cache.setToCache('user', null);
        Cache.setToCache('Authentication', null);
        localStorage.removeItem("diceHistory");
        localStorage.removeItem("rouletteHistory");
        localStorage.removeItem("flipHistory");
        localStorage.removeItem("plinko_variation_1History");
        localStorage.removeItem("wheelHistory");
        localStorage.removeItem("wheel_variation_1History");
        localStorage.removeItem("kenoHistory");
        localStorage.removeItem("customization");
        localStorage.removeItem("affiliate");
        localStorage.removeItem("appInfo");
        localStorage.removeItem("user");
        sessionStorage.clear();
        await store.dispatch(setProfileInfo(null));
        this.setState({ user: null });
        window.location.reload();
        window.location.href = '/'
    };

    renderLoginRegisterModal = () => {

        const {ln} = this.props;
        const copy = CopyText.homepage[ln];
        const { logo } = getAppCustomization();

        const { registerLoginModalOpen, error, has2FA} = this.state;
        return registerLoginModalOpen ? (
            <Modal onClose={this.handleRegisterLoginModalClose}>
                <div styleName="modal">
                    <img src={logo.id} styleName="tkn_logo_login"/>
                    <div styleName="tabs">
                        <Tabs
                        selected={registerLoginModalOpen}
                        options={[
                            {
                            value: "register",
                            label: copy.CONTAINERS.APP.MODAL[0]
                            },
                            { value: "login", label: copy.CONTAINERS.APP.MODAL[1] }
                        ]}
                        onSelect={this.handleTabChange}
                        style="full-background"
                        />
                    </div>

                {registerLoginModalOpen === "login" ? (
                    <LoginForm onSubmit={has2FA ? this.handleLogin2FA : this.handleLogin} error={error} has2FA={has2FA} onClose={this.handleRegisterLoginModalClose} onHandleResetPassword={this.handleResetPasswordOpen}/>
                ) : (
                    <RegisterForm onSubmit={this.handleRegister} error={error} />
                )}
                </div>
            </Modal>
        ) : null;
    };

    renderResetPasswordModal = () => {
        const {ln} = this.props;
        const copy = CopyText.homepage[ln];
        const { resetPasswordOpen, resetPasswordParams, resetPasswordMode } = this.state;

        return resetPasswordOpen ? (
            <Modal onClose={this.handleResetPasswordModalClose}>
                <div styleName="modal">
                    <div styleName="tabs">
                        <Tabs
                        selected='login'
                        options={[
                            { value: "login", label: copy.CONTAINERS.APP.MODAL[1] }
                        ]}
                        />
                    </div>
                    <ResetPassword params={resetPasswordParams} mode={resetPasswordMode} onClose={this.handleResetPasswordModalClose}/>
                </div>
            </Modal>
        ) : null;
    };

    renderConfirmEmailModal = () => {
        const {ln} = this.props;
        const copy = CopyText.homepage[ln];
        const { confirmEmailOpen, confirmEmailParams } = this.state;

        return confirmEmailOpen ? (
            <Modal onClose={this.handleConfirmEmailModalClose}>
                <div styleName="modal">
                    <div styleName="tabs">
                        <Tabs
                        selected='register'
                        options={[
                            { value: "register", label: copy.CONTAINERS.APP.MODAL[2] }
                        ]}
                        />
                    </div>
                    <ConfirmEmail params={confirmEmailParams} onClose={this.handleConfirmEmailModalClose}/>
                </div>
            </Modal>
        ) : null;
    };

    renderCashierModal = () => {
        const { cashierOpen } = this.state;

        return cashierOpen ? (
            <Modal onClose={this.handleCashierModalClose}>
                <CashierForm onClose={this.handleCashierModalClose} />
            </Modal>
        ) : null;
    };

    renderTableDetailsModal = () => {
        const { tableDetailsOpen, tableDetails } = this.state;

        if (tableDetailsOpen) {
            const { row } = tableDetails;

            return (
                <Modal onClose={this.handleTableDetailsModalClose}>
                    <BetDetails onClose={this.handleTableDetailsModalClose} tableDetails={tableDetails} betId={row.id} />
                </Modal>
            )
            
        }

        return null;
    };

    renderJackpotModal = () => {
        const { modal } = this.props;

        return modal.JackpotModal ? (
            <Modal onClose={this.handleJackpotModalClose}>
                <Jackpot message={modal.JackpotModal} />
            </Modal>
        ) : null;
    };

    updateAppInfo = async () => {


        let app = await getAppInfo();

        Cache.setToCache("appInfo", app);
        this.setState({...this.state, app})
    };

    isGameAvailable = metaName => {
        const appInfo = Cache.getFromCache("appInfo");
        if (!appInfo) return null;
        return find(appInfo.games, { metaName: metaName });
    };

    expandChatClick = () => {
        const { chatExpand } = this.state;

        this.setState({ chatExpand : !chatExpand });
    };


    renderGamePages = ({history}) => {
        return (
            <>
                {this.isGameAvailable("linear_dice_simple") ? (
                    <Route
                    exact
                    path="/casino/linear_dice_simple"
                    render={props => (
                        <DicePage
                        {...props}
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        onTableDetails={this.handleTableDetailsOpen}
                        />
                    )}
                    />
                ) : null}
                {this.isGameAvailable("coinflip_simple") ? (
                    <Route
                    exact
                    path="/casino/coinflip_simple"
                    render={props => (
                        <FlipPage
                        {...props}
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        onTableDetails={this.handleTableDetailsOpen}
                        />
                    )}
                    />
                ) : null}
                {this.isGameAvailable("european_roulette_simple") ? (
                    <Route
                    exact
                    path="/casino/european_roulette_simple"
                    render={props => (
                        <RoulettePage
                        {...props}
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        onTableDetails={this.handleTableDetailsOpen}
                        />
                    )}
                    />
                ) : null}
                {this.isGameAvailable("wheel_simple") ? (
                    <Route
                    exact
                    path="/casino/wheel_simple"
                    render={props => (
                        <WheelPage
                        {...props}
                        game={this.isGameAvailable("wheel_simple")}
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        onTableDetails={this.handleTableDetailsOpen}
                        />
                    )}
                    />
                ) : null}
                    {this.isGameAvailable("wheel_variation_1") ? (
                    <Route
                    exact
                    path="/casino/wheel_variation_1"
                    render={props => (
                        <WheelVariation1
                            {...props}
                            game={this.isGameAvailable("wheel_variation_1")}
                            onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                            onTableDetails={this.handleTableDetailsOpen}
                        />
                    )}
                    />
                ) : null}
                    {this.isGameAvailable("plinko_variation_1") ? (
                    <Route
                    exact
                    path="/casino/plinko_variation_1"
                    render={props => (
                        <PlinkoPage
                        {...props}
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        onTableDetails={this.handleTableDetailsOpen}
                        />
                    )}
                    />
                ) : null}
                    {this.isGameAvailable("keno_simple") ? (
                    <Route
                    exact
                    path="/casino/keno_simple"
                    render={props => (
                        <KenoPage
                        {...props}
                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                        onTableDetails={this.handleTableDetailsOpen}
                        />
                    )}
                    />
                ) : null}
            </>
        )
    }

    render() {
        const { user, app, isLoading, chatMobileOpen, betsListOpen, settingsMenuOpen, chatExpand } = this.state;
        const { profile, startLoadingProgress, modal } = this.props;
        const mobileBreakpoint = 768;
        const tabletBreakpoint = 1024;

        if (!app || isLoading) {return null};
        const { progress, confirmations } = startLoadingProgress;

        let progress100 = parseInt(progress/confirmations*100);
        let isUserLoaded = (confirmations == progress);
        const { topBar, background } = getAppCustomization();
        const centerStyles = classNames("center", {
            centerExpand: !chatExpand
        });
        const chatStyles = classNames("chat-container-main", {
            chatDisplay: chatMobileOpen,
            chatExpandDisplay: !chatExpand
        });
        const betsListStyles = classNames("bets-container-main", {
            betsListDisplay: betsListOpen
        });
        const settingsMenuStyles = classNames("settings-container-menu", {
            settingsMenuDisplay: settingsMenuOpen,
            settingsMenuHidden: !settingsMenuOpen
        });

        return (
                <UserContext.Provider
                    value={{
                        user,
                        setUser: (() => {})
                    }}
                >
                    <Router history={history}>
                        <Widgets/>
                        <header>
                            <Navbar
                                history={history}
                                onAccount={this.handleAccountOpen}
                                onLogout={this.handleLogout}
                                onLoginRegister={this.handleLoginOrRegisterOpen}
                                onCashier={this.handleCashierOpen}
                                onMenuItem={this.handleOpenMenuItem}
                                onSettingsMenu={this.handlSettingsMenuOpen}
                            />
                            {this.renderLoginRegisterModal()}
                            {this.renderResetPasswordModal()}
                            {this.renderConfirmEmailModal()}
                            {this.renderCashierModal()}
                            {this.renderTableDetailsModal()}
                            {this.renderJackpotModal()}
                            <Authentication2FAModal/>
                            <AffiliateWithdrawForm/>
                            <NotificationForm user={user}/>
                        </header>
                        <div>
                            <div styleName='top-bars'>
                                <AnnouncementTab topBar={topBar}/>
                            </div>
                            <div styleName='main'>
                                <div styleName={centerStyles} style={{background : background ? 'url('+background.id+') center center / cover no-repeat' : null }}>
                                    <div styleName='platform-container'>
                                        <Switch history={history}>
                                            <Route
                                                exact
                                                path="/"
                                                render={props => (
                                                    <HomePage
                                                        {...props}
                                                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                                                        onTableDetails={this.handleTableDetailsOpen}
                                                    />
                                            
                                                )}
                                            />

                                            <Route
                                                exact
                                                path="/casino"
                                                render={props => (
                                                    <CasinoHomePage
                                                        {...props}
                                                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                                                        onTableDetails={this.handleTableDetailsOpen}
                                                    />
                                            
                                                )}
                                            />

                                            <Route
                                                exact
                                                path="/esports"
                                                render={props => (
                                                    <EsportsHomePage
                                                        {...props}
                                                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                                                        onTableDetails={this.handleTableDetailsOpen}
                                                        history={history}
                                                    />
                                            
                                                )}
                                            />

                                            <Route
                                                exact
                                                path="/esports/matches"
                                                render={props => (
                                                    <EsportsMatchesPage
                                                        {...props}
                                                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                                                        onTableDetails={this.handleTableDetailsOpen}
                                                        history={history}
                                                    />
                                            
                                                )}
                                            />  

                                            <Route
                                                exact
                                                path="/esports/:match"
                                                render={props => (
                                                    <EsportsMatchPage
                                                        {...props}
                                                        onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}
                                                        onTableDetails={this.handleTableDetailsOpen}
                                                    />
                                            
                                                )}
                                            />

                                            <Route
                                                path="/settings"
                                                render={({ match: { url }}) => (
                                                    <>
                                                        <Route 
                                                            exact
                                                            path={`${url}/`} 
                                                            render={props => <AccountPage {...props} onHandleLoginOrRegister={this.handleLoginOrRegisterOpen} onLogout={this.handleLogout}/>} />
                                                        <Route 
                                                            path={`${url}/account`} 
                                                            render={props => <AccountPage {...props} onHandleLoginOrRegister={this.handleLoginOrRegisterOpen} onLogout={this.handleLogout}/>} />
                                                        <Route 
                                                            path={`${url}/security`} 
                                                            render={props => <AccountPage {...props} onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}/>} />
                                                        <Route 
                                                            path={`${url}/bets`} 
                                                            render={props => <AccountPage {...props} onHandleLoginOrRegister={this.handleLoginOrRegisterOpen} onTableDetails={this.handleTableDetailsOpen}/>} />
                                                        <Route 
                                                            path={`${url}/wallet`} 
                                                            render={props => <AccountPage {...props} onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}/>} />
                                                        <Route 
                                                            path={`${url}/deposits`} 
                                                            render={props => <AccountPage {...props} onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}/>} />
                                                        <Route 
                                                            path={`${url}/withdraws`} 
                                                            render={props => <AccountPage {...props} onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}/>} />
                                                        <Route 
                                                            path={`${url}/affiliate`} 
                                                            render={props => <AccountPage {...props} onHandleLoginOrRegister={this.handleLoginOrRegisterOpen} />} />
                                                        <Route 
                                                            path={`${url}/preferences`} 
                                                            render={props => <AccountPage {...props} onHandleLoginOrRegister={this.handleLoginOrRegisterOpen}/>} />
                                                    </>
                                                )}
                                            />

                                            <Route
                                                exact
                                                path="/password/reset"
                                                render={props => (
                                                    <HomePage
                                                        {...props}
                                                        onHandleResetPassword={this.handleResetPasswordOpen}
                                                        onTableDetails={this.handleTableDetailsOpen}
                                                    />
                                            
                                                )}
                                            /> 

                                            <Route
                                                exact
                                                path="/confirm/:app"
                                                render={props => (
                                                    <HomePage
                                                        {...props}
                                                        onHandleConfirmEmail={this.handleConfirmEmailOpen}
                                                        onTableDetails={this.handleTableDetailsOpen}
                                                    />
                                            
                                                )}
                                            /> 

                                            {/* New routes need to be add here, before renderGamePages */}

                                            {this.renderGamePages({history})}

                                        </Switch>
                                        <Footer/>
                                    </div>
                                </div>
                                <div styleName={chatStyles} >
                                    <a href="#" onClick={this.expandChatClick}>
                                        <div styleName="chat-expand">
                                            <div>
                                                <ChatIcon/> 
                                            </div>
                                        </div> 
                                    </a>
                                    <div styleName={'chat-container'}>
                                        <ChatPage/>
                                    </div>
                                </div>
                                {
                                    document.documentElement.clientWidth <= mobileBreakpoint 
                                    ?
                                        <div styleName={betsListStyles} > 
                                            <div styleName={'bets-container'}>
                                                <LastBets onTableDetails={this.handleTableDetailsOpen} />
                                            </div>
                                        </div>
                                    :
                                        null
                                }
                                {
                                    document.documentElement.clientWidth <= tabletBreakpoint 
                                    ?
                                        <div styleName={settingsMenuStyles} > 
                                            <div styleName={'settings-container'}>
                                                <MobileMenu onMenuItem={this.handleOpenMenuItem} history={history}/>
                                            </div>
                                        </div>
                                    :
                                        null
                                }
                            </div>
                            <PopupForm user={user}/>
                        </div>
                        <BottomNavbar
                            history={history}
                            onCashier={this.handleCashierOpen}
                            onChat={this.handleChatOpen}
                            onHome={this.handleHomeOpen}
                            onBetsList={this.handleBetsListOpen}
                            onLoginRegister={this.handleLoginOrRegisterOpen}
                            onMenuItem={this.handleOpenMenuItem}
                        />
                    </Router>
                </UserContext.Provider>
        );
    }
}


function mapStateToProps(state){
    return {
        profile : state.profile,
        startLoadingProgress : state.startLoadingProgress,
        modal : state.modal,
        currency : state.currency,
        ln: state.language
    };
}

export default connect(mapStateToProps)(App);

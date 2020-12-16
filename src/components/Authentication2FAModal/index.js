import React, { Component } from "react";
import { Modal, Typography, HorizontalStepper } from "components";
import { connect } from "react-redux";
import  QRCode from 'qrcode.react';
import Security2FASingleton from '../../lib/security/2FA';
import Input2FA from './Input2FA';
import store from "../../containers/App/store";
import { setModal } from "../../redux/actions/modal";
import { set2FA } from "../../redux/actions/set2FA";
import info from 'assets/info.png';
import _ from 'lodash';
import "./index.css";
import { CopyText } from '../../copy';
import { getApp } from "../../lib/helpers";

class Authentication2FAModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    onClose = async () => {
        this.setState({ error : null});
        await store.dispatch(setModal({key : 'Authentication2FAModal', value : false}));
    }

    set2FAAuthenticator = async ({token}) => {
        const { profile } = this.props;
        const { auth_2fa } = this.state;
        const secret = auth_2fa.secret;
        const {ln} = this.props;
        const copy = CopyText.authentication2FAModalIndex[ln];

        try {
            let verified = Security2FASingleton.isVerifiedToken2FA( { secret, token } );
            if (!verified) { 
                const error = copy.INDEX.ERROR.ERROR[0];
                this.setState({ error }) 
                return false;
            }

            let res = await profile.set2FA({
                token, secret
            })

            if (res.data.status === 200) {
                await store.dispatch(set2FA({isActive : true}));
            }
            else {
                const error = copy.INDEX.ERROR.ERROR[1];
                this.setState({ error }) 
                return false;
            }

            this.onClose();
        } catch(err) {
            console.log(err);
            throw err;
        }
    }

    onChange = (e) => {
        this.setState({ input : e});
    }

    projectData = async (props) => {
        const { profile } = props;

        if(!profile || _.isEmpty(profile)){return}
        if(_.isEmpty(profile.user_id)){return}
        let auth_2fa = this.state.auth_2fa;

        if(_.isEmpty(auth_2fa)){
            const secret2FAName = getApp().name + ":" + profile.getUsername();
            let res = Security2FASingleton.generateSecret2FA({name : secret2FAName, account_id : profile.user_id});
            auth_2fa = {
                uri : decodeURIComponent(res.uri),
                secret : res.secret
            }
        }
        this.setState({ auth_2fa })     
    }

    render() {
        const { modal } = this.props;
        const { auth_2fa, error } = this.state;
        const {ln} = this.props;
        const copy = CopyText.authentication2FAModalIndex[ln];

        if(!modal.Authentication2FAModal){ return null };
        return (    
            <Modal onClose={this.onClose}>
                <div styleName="root" style={{ overflowY: 'auto', overflowX : 'hidden'}}>
                    <div >
                        <Typography variant='body' color={"grey"} weight={"bold"}> {copy.INDEX.TYPOGRAPHY.TEXT[0]}</Typography>
                    </div>
                    <div styleName='root-code'>
                        <div styleName="content">
                            <HorizontalStepper 
                                alertCondition={!_.isEmpty(error)}
                                alertIcon={info}
                                alertMessage={error}
                                showStepper={false}
                                steps={[
                                    {
                                        label : copy.INDEX.HORIZONTAL_STEPPER.LABEL[0],
                                        title : copy.INDEX.HORIZONTAL_STEPPER.TITLE[0],
                                        first : true,
                                        condition : true,
                                        content : <div styleName="qrcode"><QRCode value={auth_2fa.uri} bgColor={"#fff"} fgColor={"#000"} /></div>
                                    },
                                    {
                                        label : copy.INDEX.HORIZONTAL_STEPPER.LABEL[1],
                                        title : copy.INDEX.HORIZONTAL_STEPPER.TITLE[1],
                                        condition : true,
                                        content : <div styleName="token2FA"><Input2FA secret={`secret`} confirm={this.set2FAAuthenticator}/></div>,
                                        last : true,
                                        closeStepper : this.onClose
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}


function mapStateToProps(state){
    return {
        profile : state.profile,
        modal : state.modal,
        set2FA : state.set2FA,
        ln: state.language
    };
}

export default connect(mapStateToProps)(Authentication2FAModal);

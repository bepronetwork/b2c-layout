import React from "react";
import { Typography, CopyIcon } from 'components';
import { connect } from "react-redux";
import classNames from "classnames";
import { getApp, getAppCustomization, getIcon } from "../../lib/helpers";
import { CopyText } from '../../copy';
import './index.css';

const info = getApp();

const arr = window.location.href.split("/");
const url = arr[0] + "//" + arr[2];
const URL_REF = url + `/?ref=`;

class AffiliateLinkContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            copied: false
        }
    }

    componentDidMount(){
        this.setState({ copied: false});
    }

    componentWillReceiveProps(){
        this.setState({ copied: false});
    }

    copyToClipboard = () => {
        const { link } = this.props;
        var textField = document.createElement('textarea');
        textField.innerText = URL_REF + link;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();

        this.setState({ copied: true })
    };

    render(){
        const { 
            link,
            percentageOnLevelOne
        } = this.props;
        const { copied } = this.state;
        const {ln} = this.props;
        const copy = CopyText.affiliateLinkContainerIndex[ln];
        const { skin } = getAppCustomization();
        const addressStyles = classNames("address", {"ad-copied": copied});
        const copyIcon = getIcon(27);

        return (
            <div styleName={`root`}>
                <div styleName='content'>
                    <div styleName={'text-description'}>
                        <Typography variant={'body'} color={`white`}>
                            {copy.INDEX.TYPOGRAPHY.FUNC_TEXT[0](info.name)}
                        </Typography>
                        <div styleName='subtitle-text'>
                            <Typography variant={'x-small-body'} color={`grey`}>
                            {copy.INDEX.TYPOGRAPHY.FUNC_TEXT[1](percentageOnLevelOne*100)}
                            </Typography>
                        </div>
                    </div>
                    {copied ? (
                        <div styleName="copied">
                            <Typography variant="small-body" color={'white'}>
                                Copied
                            </Typography>
                        </div>
                    ) : null}
                    <div styleName={addressStyles}>
                        <div styleName='link-text-container'>
                            <Typography variant={'x-small-body'} color={skin.skin_type == "digital" ? `white` : `casper`}>
                                {URL_REF + link}
                            </Typography>
                        </div>
                        <div>
                            <button onClick={this.copyToClipboard} styleName='text-copy-container'>
                                {
                                    skin.skin_type == "digital"
                                    ?
                                        <div styleName="icon">
                                            {copyIcon === null ? <CopyIcon /> : <img src={copyIcon} />}
                                        </div>
                                    :
                                        null
                                }
                                <Typography variant={'small-body'} color={'fixedwhite'}>
                                    {copy.INDEX.TYPOGRAPHY.TEXT[0]}
                                </Typography>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(AffiliateLinkContainer);

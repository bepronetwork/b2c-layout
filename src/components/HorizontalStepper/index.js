import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import SettingsIcon from '@material-ui/icons/Settings';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import StepConnector from '@material-ui/core/StepConnector';
import { Typography, Button, InformationBox } from 'components';
import { Col, Row } from 'reactstrap';
import store from '../../containers/App/store';
import { setDepositInfo } from '../../redux/actions/deposit';
import _ from 'lodash';
import './index.css';
import allow from 'assets/allow.png';
import { CopyText } from '../../copy';
import { connect } from "react-redux";


const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: 'white',
    },
  },
  completed: {
    '& $line': {
      borderColor: 'grey',
    },
  },
  line: {
    borderColor: "white",
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
    root: {
        color: 'transparent',
        display: 'flex',
        height: 22,
        alignItems: 'center',
    },
    active: {
        color: 'white',
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    completed: {
        color: 'white',
        zIndex: 1,
        fontSize: 18,
    },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

QontoStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
};

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: 'transparent',
    zIndex: 1,
    width: 50,
    backgroundColor : 'transparent',
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
  
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
    icon: PropTypes.node,
    };

    const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        margin : 'auto',
        backgroundColor : 'transparent',

    },
    stepLabel : {
        color : 'white'
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

const HorizontalStepper = (props) => {
    
    const { steps, nextStep, alertCondition, alertIcon, alertMessage, showStepper } = props;
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    let step = steps[activeStep];
    const { pass, title, content, condition, first, last, closeStepper, showCloseButton = true, nextButtonLabel } = step;
    const {ln} = props;

    const copy = CopyText.horizontalStepperIndex[ln];

    if(pass){handleNext();}
    if(nextStep && (activeStep+1 < steps.length)){
        handleNext();
        store.dispatch(setDepositInfo({key : 'nextStep', value : false}));
    }

    function handleNext() {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    }

    function handleBack() {
        if(!steps[activeStep-1]){return }
        let previousPass =  steps[activeStep-1].pass;
        if(previousPass){
            setActiveStep(prevActiveStep => prevActiveStep - 1);

        }
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    function handleReset() {
        setActiveStep(0);
    }

    return (
        <div className={classes.root}>
            <div styleName='stepper-root'>
                {showStepper ?
                    <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                        {steps.map( ({label}) => (
                            <Step key={label}>
                                <StepLabel className={classes.stepLabel} StepIconComponent={QontoStepIcon}>
                                    <Typography 
                                        variant={'small-body'} color={'casper'}>{label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                : null}
            </div>
            <div styleName='container-title'>
                <Typography variant={'small-body'} color={'white'}>
                    {title}
                </Typography>
            </div>
            {alertCondition ? <InformationBox message={alertMessage} image={!_.isEmpty(alertIcon) ? alertIcon : allow}/> : content}
            <div>
                {activeStep === steps.length ? (
                <div>
                    <Typography className={classes.instructions}>
                        {copy.INDEX.TYPOGRAPHY.TEXT[0]}
                    </Typography>
                    <Button onClick={handleReset} className={classes.button}>
                        {copy.INDEX.BUTTON.TEXT[0]}
                    </Button>
                </div>
                ) : (
                <div styleName='buttons'>
                    {
                        last 
                        ?  (
                        <div>
                            <Row>
                                <Col md={showCloseButton ? 6 : 12}>   
                                    <div styleName='button-stepper'>
                                        <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                            <Typography variant={'small-body'} color={'white'}> {copy.INDEX.TYPOGRAPHY.TEXT[1]}  </Typography>
                                        </Button>
                                    </div>
                                </Col>
                                {
                                    showCloseButton
                                    ? (
                                        <Col md={6}>
                                            <div styleName='button-stepper'>
                                                <Button
                                                    variant="contained"
                                                    disabled={!condition}
                                                    color="primary"
                                                    onClick={closeStepper}
                                                    className={classes.button}
                                                >
                                                    <Typography  variant={'small-body'} color={'white'}> {copy.INDEX.TYPOGRAPHY.TEXT[2]} </Typography>
                                                </Button>
                                            </div>
                                        </Col>
                                    )
                                    :
                                    null
                                }
                            </Row> 
                        </div>    
                        ) : (
                        <div>
                            {
                                !first
                                ? (
                                <Row>
                                    <Col md={6}>   
                                        <div styleName='button-stepper'>
                                            <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                                <Typography variant={'small-body'} color={'white'}> {copy.INDEX.TYPOGRAPHY.TEXT[3]} </Typography>
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col md={6}>   
                                        <div styleName='button-stepper'>
                                            <Button
                                                variant="contained"
                                                disabled={!condition}
                                                color="primary"
                                                onClick={handleNext}
                                                className={classes.button}
                                            >
                                                <Typography  variant={'small-body'} color={'white'}>{nextButtonLabel ? nextButtonLabel : copy.INDEX.TYPOGRAPHY.TEXT[4]} </Typography>
                                            </Button>      
                                        </div>               
                                    </Col>
                                </Row>
                                ) : (
                                <Row>
                                    <Col md={12}>   
                                        <div styleName='button-stepper'>
                                            <Button
                                                variant="contained"
                                                disabled={!condition}
                                                color="primary"
                                                onClick={handleNext}
                                                className={classes.button}
                                            >
                                                <Typography  variant={'small-body'} color={'white'}>{nextButtonLabel ? nextButtonLabel : copy.INDEX.TYPOGRAPHY.TEXT[5]} </Typography>
                                            </Button>      
                                        </div>               
                                    </Col>
                                </Row>
                                )
                            }
                        </div>
                        )
                    }
                </div>
                )}
            </div>
        </div>
    );

}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}


export default connect(mapStateToProps)(HorizontalStepper);

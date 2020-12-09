import React from 'react';
import AnimatedNumber from 'react-animated-number';
import { Typography } from 'components';
import { formatCurrency } from '../../utils/numberFormatation';
import "./index.css";

const defaultProps = {
    number : 0,
    decimals : 2,
    variant : 'h4',
    color :'white',
    span : null,
    isCurrency: false
}

class AnimationNumber extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            number : props.number ? props.number : defaultProps.number,
            color : props.color ? props.color : defaultProps.color,
            variant : props.variant ? props.variant : defaultProps.variant,
            span : props.span ? props.span : defaultProps.span,
            isCurrency : props.isCurrency ? props.isCurrency : defaultProps.isCurrency
        }
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    projectData = async (props) => {
        const { number, color, variant, span, isCurrency } = props;
        if(this.state.number == props.number){return null};
        this.setState({
           number : number ? number : defaultProps.number,
           color : color ? color : defaultProps.color,
           variant : variant ? variant : defaultProps.variant,
           span : span ? span : defaultProps.span,
           isCurrency : isCurrency ? isCurrency : defaultProps.isCurrency
       })
        
    }

    shouldComponentUpdate(nextProps){
        return this.state.number != nextProps.number;
    }

    render = () => {
        const { number, variant='h4', color='white', span=null, isCurrency } = this.state;
        return (
            <Typography variant={variant} color={color}>
                <AnimatedNumber 
                    style={{
                        transition: '0.4s ease-out',
                        transitionProperty:
                            'background-color, color, opacity'
                    }}
                    frameStyle={perc => (
                        perc === 100 ? {} : {opacity: 1}
                    )}
                    duration={500}
                    value={number}
                    formatValue={n => isCurrency ? formatCurrency(n) : n}/>
                <span style={{marginLeft : 4, fontSize : 18, opacity : 0.4}}>{span}</span>
            </Typography>
        );
    }
}






export default AnimationNumber;

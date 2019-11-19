import React from 'react';
import AnimatedNumber from 'react-animated-number';
import { Numbers } from '../../lib/ethereum/lib';
import { Typography } from 'components';

import "./index.css";

const defaultProps = {
    number : 0,
    variant : 'h4',
    color :'white',
    span : null 
}

class AnimationNumber extends React.Component{

    constructor(props) {
        super(props);
        this.state = defaultProps;
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    projectData = async (props) => {
        const { number, color, variant, span } = props;
        if(this.state.number == props.number){return null};
        this.setState({
           number : number ? number : defaultProps.number,
           color : color ? color : defaultProps.color,
           variant : variant ? variant : defaultProps.variant,
           span : span ? span : defaultProps.span
       })
        
    }

    shouldComponentUpdate(nextProps){
        return this.state.number != nextProps.number;
    }

    render = () => {
        const { number, variant='h4', color='white', span=null } = this.state;
        console.log(number)
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
                formatValue={n => Numbers.toFloat(n)}/>
                <span style={{marginLeft : 4, fontSize : 18, opacity : 0.4}}>{span}</span>
            </Typography>
        );
    }
}






export default AnimationNumber;

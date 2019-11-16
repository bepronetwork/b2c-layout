import React from 'react';
import AnimatedNumber from 'react-animated-number';
import { Numbers } from '../../lib/ethereum/lib';
import { Typography } from 'components';

import "./index.css";

const AnimationNumber = ({number, variant='h4', color='white', span=null}) => {
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
                duration={300}
                value={number}
            formatValue={n => Numbers.toFloat(n)}/>
            <span style={{marginLeft : 4, fontSize : 18, opacity : 0.4}}>{span}</span>
        </Typography>

)};



export default AnimationNumber;

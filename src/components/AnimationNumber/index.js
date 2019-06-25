import React from 'react';
import AnimatedNumber from 'react-animated-number';
import { Numbers } from '../../lib/ethereum/lib';
import { Typography } from 'components';

import "./index.css";

const AnimationNumber = ({number}) => {
    return (
        <Typography variant="h4" color="white">
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
                component="text"
            formatValue={n => Numbers.toFloat(n)}/>
        </Typography>

)};



export default AnimationNumber;

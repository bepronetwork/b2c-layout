import React, { Component } from "react";
import Dices from "components/Icons/Dices";
import {  CoinFlip, Roulette } from "components";
import dices from 'assets/dices.png';
import roulette from 'assets/roulette.png';
import coins from 'assets/coins.png';

const games = [{
    name : 'Linear Dice',
    path :"/dice",
    title : "Linear Dice",
    color: "dice-background-color",
    content : <Dices/>,
    image : dices
}, {
    name : 'Roulette',
    path :"/roulette",
    title : "Roulette",
    color: "roulette-background-color",
    content : <Roulette/>,
    image : roulette
},  {
    name : 'CoinFlip',
    path :"/coinflip",
    title : "CoinFlip",
    color: "coinflip-background-color",
    content : <CoinFlip/>,
    image : coins
}];


export default games;
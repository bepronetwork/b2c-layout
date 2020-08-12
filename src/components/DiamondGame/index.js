import React, { Component } from "react";

import DiamondFill from "../../assets/DiamondIcons/diamond-fill.svg";

import "./index.css";

class DiamondGame extends Component {
  render() {
    return (
      <div styleName="container">
        <div>
          <table>
            <tbody>
              <tr styleName="result-container">
                <td>
                  <span>
                    <img src={DiamondFill} alt="React Logo" />
                  </span>
                </td>
                <td>0,00x</td>
              </tr>
              <tr>
                <td>February</td>
                <td>$80</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Sum</td>
                <td>$180</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div styleName="second-container">
          <p>TESTE</p>
        </div>
      </div>
    );
  }
}

export default DiamondGame;

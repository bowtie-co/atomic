import React, { Component } from "react";
import { atoms } from '../../src';

const { ButtonBasic } = atoms;

class App extends Component {
  render() {
    return (
        <ButtonBasic block className='AppButton' color='success'>
          A Button
        </ButtonBasic>
    );
  }
}

export default App;

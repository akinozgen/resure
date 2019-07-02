import React from 'react';
import NavbarToggler from "./helpers/NavbarToggler";
import Brand from "./helpers/Brand";
import LoginUserMenu from "./helpers/LoginUserMenu";

export default class Root extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className={'resure-app'}>
        <nav className="nav navbar-expand-lg  navbar navbar-resure">
          <div className="container">
            <Brand/>
            <NavbarToggler/>
            <LoginUserMenu state={this.props.state} setState={this.props.setState} />
          </div>
        </nav>
        
        <div className="context">{this.props.children}</div>
      </div>
    );
  }
}
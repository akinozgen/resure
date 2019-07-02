import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Loader} from "./Loader";

class LoginUserMenu extends React.Component {
  constructor(props) {
    super(props);
    
    this.checkAuthState = this.checkAuthState.bind(this);
    this.performLogout = this.performLogout.bind(this);
    this.performLogin = this.performLogin.bind(this);
  }
  
  performLogout() {
    const response = fetch('/auth/perform_logout');
    response.then(response => {
      if (response.statusText !== 'OK') return;
      window.location = '/';
    });
  }
  
  checkAuthState() {
    if (this.props.state.authState === true) return [
      <li className="nav-item">
        <Link to="/" className="nav-link">
          Profile
        </Link>
      </li>,
      <li className="nav-item dropdown">
        <Link id="navbarDropdown"
              className="nav-link dropdown-toggle"
              to="/"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
          {this.props.state.user.name} <span className="caret"></span>
        </Link>
        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
          <Link className="dropdown-item" to="/">
            Settings
          </Link>
          <Link className="dropdown-item" to="/" onClick={this.performLogout}>
            Logout
          </Link>
        </div>
      </li>
    ];
    
    else if (this.props.state.authState === null) return <Loader />;
    
    return (
      <a href={'javascript:void(0)'} onClick={this.performLogin}>
        <img src={'img/twitter.svg'} alt=""/> Login with Twitter
      </a>
    );
  }
  
  performLogin() {
    window.location = this.props.state.twitterLoginUrl;
  }
  
  render() {
    return <div className="collapse navbar-collapse show" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto">
        <li className="nav-link">
        
        </li>
      </ul>
      
      <ul className="navbar-nav ml-auto">
        {this.checkAuthState()}
      </ul>
    </div>;
  }
}

export default LoginUserMenu;
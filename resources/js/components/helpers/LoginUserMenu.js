import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Loader} from "./Loader";
import {Menu} from "antd";
import Dropdown from "antd/lib/dropdown";
import {API_CONFIG} from "../../api/config";

class LoginUserMenu extends React.Component {
  constructor(props) {
    super(props);

    this.checkAuthState = this.checkAuthState.bind(this);
    LoginUserMenu.getLoggedInUserMenu = LoginUserMenu.getLoggedInUserMenu.bind(this);
  }

  static performLogout() {
    const response = fetch('/auth/perform_logout');
    response.then(response => {
      if (response.statusText !== 'OK') return;
      window.location = '/';
    });
  }
  
  static getLoggedInUserMenu() {
    return (
      <Menu>
        <Menu.Item key="0">
          <Link className="nav-link" to="/">
            Settings
          </Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="2">
          <Link to="/my_followers" className="nav-link">
            My Followers
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/following" className="nav-link">
            Following
          </Link>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="4">
          <Link className="nav-link" to="/" onClick={LoginUserMenu.performLogout}>
            Logout
          </Link>
        </Menu.Item>
      </Menu>
    );
  }

  checkAuthState() {
    if (this.props.state.authState === true) return (
      <li className="nav-item dropdown">
        <Dropdown overlay={LoginUserMenu.getLoggedInUserMenu} trigger={['click']}>
          <a id="navbarDropdown" className="ant-dropdown-link nav-link dropdown-toggle" role="button" href="#">
            {this.props.state.user.name} <span className="caret"/>
          </a>
        </Dropdown>
      </li>
    );

    else if (this.props.state.authState === null) return <Loader />;

    return (
      <a href={'javascript:void(0)'} onClick={LoginUserMenu.performLogin}>
        <img src={'img/twitter.svg'} alt=""/> Login with Twitter
      </a>
    );
  }

  static performLogin() {
    window.location = API_CONFIG.loginUrl;
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

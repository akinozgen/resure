import React from 'react';
import Root from "./Root";
import {BrowserRouter, Route, Link} from 'react-router-dom';

import WelcomePage from "../pages/Welcome";
import LoginPage from "../pages/Login";
import ProfilePage from '../pages/Profile';
import { Loader } from './helpers/Loader';
import UserProfile from "../pages/UserProfile";

export default class Router extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authState: null,
      authToken: null,
      debug: true,
      twitterLoginUrl: 'auth/redirect/twitter'
    };
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    const newState = JSON.stringify(nextState);
    if (this.state.debug) localStorage.setItem('state', newState);
  }

  componentDidMount() {
    this.checkAuth();
  }

  checkAuth() {
    const response = fetch('/auth/check_twitter_auth')
      .then(_ => _.json())
      .then(response => {
        if (response.status === true) {
          this.processAuth(response.user, response.token);
        } else {
          this.processNonAuth();
        }
      });
  }

  processAuth(user, token) {
    if (user.hasOwnProperty('id') && !(parseInt(user.id) > 0)) return;

    this.setState({ authState: true, authToken: token, user });
  }

  processNonAuth() {
    this.setState({ authState: false });
  }

  render() {
    return (
      <BrowserRouter>
        <Root state={this.state} setState={this.setState}>
          {this.state.authState ? <div className="onAuthSuccess">
            <Route exact path={'/'} initial component={() => <WelcomePage state={this.state} setState={this.setState.bind(this)} />} />
            <Route exact path={'/profile'} component={() => <ProfilePage self={true} state={this.state} setState={this.setState.bind(this)} />} />
            <Route exact path={'/@:username'} component={router => <UserProfile username={router.match.params.username} self={false} />} />
          </div> :
          <div>
            <Route exact path={'/'} initial component={() => <WelcomePage state={this.state} setState={this.setState.bind(this)} />} />
            <Route exact path={'/:anything'} initial component={() => <div className="onAuthFail"><Loader /></div>} />
          </div> }
        </Root>
      </BrowserRouter>
    );
  }
}

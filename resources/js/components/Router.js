import React from 'react';
import Root from "./Root";
import {BrowserRouter, Route, Link} from 'react-router-dom';

import WelcomePage from "../pages/Welcome";
import NotFoundPage from "../pages/NotFoundPage";
import UserProfilePage from "../pages/UserProfilePage";
import ProfilePage from "../pages/Profile";
import SettingsPage from "../pages/SettingsPage";

export default class Router extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authState: null,
      authToken: null,
      debug: true,
      twitterLoginUrl: 'auth/redirect/twitter'
    };

    this.authSuccessRoutes = this.authSuccessRoutes.bind(this);
    this.noAuthRoutes = this.noAuthRoutes.bind(this);
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

  authSuccessRoutes() {
      return <div className="onAuthSuccess">
          <Route exact path={'/'} initial component={() => <WelcomePage state={this.state} setState={this.setState.bind(this)} />} />
          <Route path={'/profile'} component={router => <UserProfilePage router={router} content="user" self={true} state={this.state} setState={this.setState.bind(this)} />} />
          <Route exact path={'/profile_edit'} component={() => <ProfilePage self={true} state={this.state} setState={this.setState.bind(this)} />} />
          <Route path={'/@:username'} component={router => <UserProfilePage router={router} content="user" state={this.state} username={router.match.params.username} self={false} />} />
      </div>;
  }

  noAuthRoutes() {
      return <div>
          <Route exact path={'/'} initial component={() => <WelcomePage state={this.state} setState={this.setState.bind(this)} />} />
          <Route path={'/:username'} component={router => {
              if (!router.match.params.username.includes('@')) return <NotFoundPage router={router} />;

              return <UserProfilePage router={router} content="user" username={router.match.params.username.replace('@', '')} state={this.state} self={false} />;
          }} />
      </div>;
  }

  render() {
    return (
      <BrowserRouter>
        <Root state={this.state} setState={this.setState}>
          {this.state.authState ? this.authSuccessRoutes() : this.noAuthRoutes() }
        </Root>
      </BrowserRouter>
    );
  }
}

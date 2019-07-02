import React, { Component } from 'react';

class LoginPage extends Component {
  render() {
    return (
      <div className="container justify-content-center">
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">Login</div>
      
              <div className="card-body">
        
                <div className="form-group row mb-0">
                  <div className="col-md-8 offset-md-4">
                    <a href="auth/redirect/twitter">
                      <img src={'img/twitter.svg'} alt=""/> Login with Twitter
                    </a>
                  </div>
                </div>
      
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
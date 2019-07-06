import React, { Component } from 'react'

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  render() {
    return (
      <div className="container">
        <h3>{this.props.state.user.name}</h3>
      </div>
    );
  }
}
export default ProfilePage
